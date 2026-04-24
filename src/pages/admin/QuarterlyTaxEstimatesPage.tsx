import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, DollarSign, Download, TrendingUp, AlertCircle, Globe, Info } from 'lucide-react';

interface QuarterEstimate {
  quarter: string;
  year: number;
  start_date: string;
  end_date: string;
  total_revenue_cents: number;
  total_commissions_cents: number;
  contractor_expense_cents: number;
  estimated_tax_cents: number;
  payment_due_date: string;
}

interface EntityEstimates {
  entity_type: 'admin' | 'partner' | 'merchant';
  entity_id: string;
  entity_name: string;
  quarters: QuarterEstimate[];
}

interface ContractorSummary {
  year_val: number;
  total_paid_usd_cents: number;
  q1_cents: number;
  q2_cents: number;
  q3_cents: number;
  q4_cents: number;
  contractor_count: number;
  pay_period_count: number;
}

export default function QuarterlyTaxEstimatesPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEntityType, setSelectedEntityType] = useState<'admin' | 'partner' | 'merchant'>('partner');
  const [estimates, setEstimates] = useState<EntityEstimates[]>([]);
  const [contractorSummary, setContractorSummary] = useState<ContractorSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuarterlyEstimates();
  }, [selectedYear, selectedEntityType]);

  const getQuarterDates = (year: number, quarter: number): { start: Date; end: Date; dueDate: Date } => {
    const quarters = [
      { start: new Date(year, 0, 1), end: new Date(year, 2, 31), dueDate: new Date(year, 3, 15) },
      { start: new Date(year, 3, 1), end: new Date(year, 5, 30), dueDate: new Date(year, 5, 15) },
      { start: new Date(year, 6, 1), end: new Date(year, 8, 30), dueDate: new Date(year, 8, 15) },
      { start: new Date(year, 9, 1), end: new Date(year, 11, 31), dueDate: new Date(year + 1, 0, 15) },
    ];
    return quarters[quarter - 1];
  };

  const fetchQuarterlyEstimates = async () => {
    try {
      setLoading(true);

      // Always load contractor summary for any view
      const { data: cData } = await supabase.rpc('get_intl_contractor_expense_summary', {
        p_year: selectedYear
      });
      if (cData && cData.length > 0) setContractorSummary(cData[0]);

      const allEstimates: EntityEstimates[] = [];

      const contractorByQuarter: Record<number, number> = {
        1: cData?.[0]?.q1_cents || 0,
        2: cData?.[0]?.q2_cents || 0,
        3: cData?.[0]?.q3_cents || 0,
        4: cData?.[0]?.q4_cents || 0,
      };

      if (selectedEntityType === 'partner') {
        const { data: partners } = await supabase
          .from('partners')
          .select('id, full_name')
          .eq('is_active', true);

        for (const partner of partners || []) {
          const quarters: QuarterEstimate[] = [];

          for (let q = 1; q <= 4; q++) {
            const { start, end, dueDate } = getQuarterDates(selectedYear, q);

            const { data: earnings } = await supabase
              .from('partner_earnings')
              .select('amount_cents, sales_ledger!inner(amount_cents)')
              .eq('partner_id', partner.id)
              .eq('status', 'paid')
              .gte('created_at', start.toISOString())
              .lte('created_at', end.toISOString());

            const totalCommissions = earnings?.reduce((sum, e) => sum + e.amount_cents, 0) || 0;
            const totalRevenue = earnings?.reduce((sum, e) => sum + (e.sales_ledger?.amount_cents || 0), 0) || 0;
            const estimatedTax = Math.round(totalCommissions * 0.37);

            if (totalCommissions > 0) {
              quarters.push({
                quarter: `Q${q}`,
                year: selectedYear,
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
                total_revenue_cents: totalRevenue,
                total_commissions_cents: totalCommissions,
                contractor_expense_cents: 0,
                estimated_tax_cents: estimatedTax,
                payment_due_date: dueDate.toISOString().split('T')[0]
              });
            }
          }

          if (quarters.length > 0) {
            allEstimates.push({
              entity_type: 'partner',
              entity_id: partner.id,
              entity_name: partner.full_name,
              quarters
            });
          }
        }
      } else if (selectedEntityType === 'merchant') {
        const { data: merchants } = await supabase
          .from('merchants')
          .select('id, business_name')
          .eq('is_active', true);

        for (const merchant of merchants || []) {
          const quarters: QuarterEstimate[] = [];

          for (let q = 1; q <= 4; q++) {
            const { start, end, dueDate } = getQuarterDates(selectedYear, q);

            const { data: orders } = await supabase
              .from('merchant_orders')
              .select('total_amount')
              .eq('merchant_id', merchant.id)
              .eq('status', 'completed')
              .gte('created_at', start.toISOString())
              .lte('created_at', end.toISOString());

            const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
            const estimatedTax = Math.round(totalRevenue * 0.25);

            if (totalRevenue > 0) {
              quarters.push({
                quarter: `Q${q}`,
                year: selectedYear,
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
                total_revenue_cents: totalRevenue,
                total_commissions_cents: 0,
                contractor_expense_cents: 0,
                estimated_tax_cents: estimatedTax,
                payment_due_date: dueDate.toISOString().split('T')[0]
              });
            }
          }

          if (quarters.length > 0) {
            allEstimates.push({
              entity_type: 'merchant',
              entity_id: merchant.id,
              entity_name: merchant.business_name,
              quarters
            });
          }
        }
      } else if (selectedEntityType === 'admin') {
        const quarters: QuarterEstimate[] = [];

        for (let q = 1; q <= 4; q++) {
          const { start, end, dueDate } = getQuarterDates(selectedYear, q);

          const [salesResult, commissionsResult] = await Promise.all([
            supabase
              .from('sales_ledger')
              .select('amount_cents')
              .gte('created_at', start.toISOString())
              .lte('created_at', end.toISOString()),
            supabase
              .from('partner_earnings')
              .select('amount_cents')
              .eq('status', 'paid')
              .gte('created_at', start.toISOString())
              .lte('created_at', end.toISOString())
          ]);

          const totalRevenue = salesResult.data?.reduce((sum, s) => sum + s.amount_cents, 0) || 0;
          const totalCommissions = commissionsResult.data?.reduce((sum, c) => sum + c.amount_cents, 0) || 0;
          const contractorExpenses = contractorByQuarter[q] || 0;

          // Contractor payments are deductible business expenses — reduce taxable net income
          const taxableIncome = Math.max(0, totalRevenue - totalCommissions - contractorExpenses);
          const estimatedTax = Math.round(taxableIncome * 0.21);

          if (totalRevenue > 0 || contractorExpenses > 0) {
            quarters.push({
              quarter: `Q${q}`,
              year: selectedYear,
              start_date: start.toISOString().split('T')[0],
              end_date: end.toISOString().split('T')[0],
              total_revenue_cents: totalRevenue,
              total_commissions_cents: totalCommissions,
              contractor_expense_cents: contractorExpenses,
              estimated_tax_cents: estimatedTax,
              payment_due_date: dueDate.toISOString().split('T')[0]
            });
          }
        }

        if (quarters.length > 0) {
          allEstimates.push({
            entity_type: 'admin',
            entity_id: 'platform',
            entity_name: 'Local-Link Platform',
            quarters
          });
        }
      }

      allEstimates.sort((a, b) => {
        const aTotal = a.quarters.reduce((sum, q) => sum + q.total_commissions_cents + q.total_revenue_cents, 0);
        const bTotal = b.quarters.reduce((sum, q) => sum + q.total_commissions_cents + q.total_revenue_cents, 0);
        return bTotal - aTotal;
      });

      setEstimates(allEstimates);
    } catch (error) {
      console.error('Error fetching quarterly estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const rows: string[] = [];

    if (selectedEntityType === 'admin') {
      rows.push('Entity,Quarter,Start Date,End Date,Revenue,Commissions Paid,Contractor Expenses (Deductible),Taxable Net Income,Estimated Tax (21%),Due Date');
      estimates.forEach(entity => {
        entity.quarters.forEach(q => {
          const taxable = Math.max(0, q.total_revenue_cents - q.total_commissions_cents - q.contractor_expense_cents);
          rows.push([
            entity.entity_name,
            `${q.quarter} ${q.year}`,
            q.start_date,
            q.end_date,
            (q.total_revenue_cents / 100).toFixed(2),
            (q.total_commissions_cents / 100).toFixed(2),
            (q.contractor_expense_cents / 100).toFixed(2),
            (taxable / 100).toFixed(2),
            (q.estimated_tax_cents / 100).toFixed(2),
            q.payment_due_date
          ].join(','));
        });
      });

      // Append contractor detail section
      if (contractorSummary) {
        rows.push('');
        rows.push('--- International Contractor Expense Detail ---');
        rows.push(`Tax Year,${contractorSummary.year_val}`);
        rows.push(`Total Paid (USD),${(contractorSummary.total_paid_usd_cents / 100).toFixed(2)}`);
        rows.push(`Q1,${(contractorSummary.q1_cents / 100).toFixed(2)}`);
        rows.push(`Q2,${(contractorSummary.q2_cents / 100).toFixed(2)}`);
        rows.push(`Q3,${(contractorSummary.q3_cents / 100).toFixed(2)}`);
        rows.push(`Q4,${(contractorSummary.q4_cents / 100).toFixed(2)}`);
        rows.push(`Contractors Paid,${contractorSummary.contractor_count}`);
        rows.push(`Pay Periods,${contractorSummary.pay_period_count}`);
        rows.push('Note: International contractors are non-US workers. Payments are ordinary business expenses — NOT subject to 1099 or payroll tax withholding.');
      }
    } else {
      rows.push('Entity,Quarter,Start Date,End Date,Revenue,Commissions,Estimated Tax,Due Date');
      estimates.forEach(entity => {
        entity.quarters.forEach(q => {
          rows.push([
            entity.entity_name,
            `${q.quarter} ${q.year}`,
            q.start_date,
            q.end_date,
            (q.total_revenue_cents / 100).toFixed(2),
            (q.total_commissions_cents / 100).toFixed(2),
            (q.estimated_tax_cents / 100).toFixed(2),
            q.payment_due_date
          ].join(','));
        });
      });
    }

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quarterly_tax_estimates_${selectedYear}_${selectedEntityType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 30;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Calculating tax estimates...</p>
        </div>
      </div>
    );
  }

  const yearTotal = estimates.reduce((sum, entity) =>
    sum + entity.quarters.reduce((qSum, q) => qSum + q.estimated_tax_cents, 0), 0
  );

  const totalContractorDeduction = contractorSummary?.total_paid_usd_cents || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quarterly Tax Estimates</h1>
          <p className="mt-2 text-gray-600">Track estimated tax payments for partners, merchants, and platform</p>
        </div>

        {/* Warning Banner */}
        <div className="mb-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Tax Disclaimer</p>
              <p className="mt-1">
                These are estimates only. Consult with a CPA or tax professional for accurate tax calculations.
                Actual tax liability may vary based on deductions, credits, and individual circumstances.
              </p>
            </div>
          </div>
        </div>

        {/* International Contractor Expense Banner (always visible) */}
        {contractorSummary && totalContractorDeduction > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-blue-900">
                      International Contractor Expenses — {selectedYear}
                    </p>
                    <p className="text-sm text-blue-700 mt-0.5">
                      {contractorSummary.contractor_count} contractor{contractorSummary.contractor_count !== 1 ? 's' : ''} •{' '}
                      {contractorSummary.pay_period_count} pay period{contractorSummary.pay_period_count !== 1 ? 's' : ''} •{' '}
                      Deductible business expense — no 1099 required
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalContractorDeduction)}</p>
                    <p className="text-xs text-blue-600">Total deductible spend</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {[
                    { label: 'Q1', value: contractorSummary.q1_cents },
                    { label: 'Q2', value: contractorSummary.q2_cents },
                    { label: 'Q3', value: contractorSummary.q3_cents },
                    { label: 'Q4', value: contractorSummary.q4_cents },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-lg px-3 py-2 text-center border border-blue-100">
                      <p className="text-xs text-blue-500 font-medium">{label}</p>
                      <p className="text-sm font-bold text-blue-900">{formatCurrency(value)}</p>
                    </div>
                  ))}
                </div>
                {selectedEntityType === 'admin' && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-700">
                    <Info className="w-3.5 h-3.5" />
                    <span>Contractor expenses are deducted from Platform taxable net income before the 21% federal estimate is applied.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
              {(['partner', 'merchant', 'admin'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedEntityType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedEntityType === type
                      ? 'bg-[#2BB673] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type === 'admin' ? 'Platform' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2BB673] text-white rounded-lg hover:bg-[#229a5e] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV for CPA
          </button>
        </div>

        {/* Summary Card */}
        <div className="mb-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-slate-300">
                Total {selectedYear} Estimated Tax Liability
              </p>
              <p className="text-4xl font-bold mt-1">{formatCurrency(yearTotal)}</p>
              <p className="text-sm text-slate-400 mt-1">
                {estimates.length} {selectedEntityType}(s)
                {selectedEntityType === 'admin' && totalContractorDeduction > 0 && (
                  <span className="ml-2 text-blue-300">
                    · {formatCurrency(totalContractorDeduction)} contractor deduction applied
                  </span>
                )}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl">
              <TrendingUp className="w-12 h-12 text-[#2BB673]" />
            </div>
          </div>
        </div>

        {/* Estimates List */}
        <div className="space-y-6">
          {estimates.map((entity) => (
            <div key={entity.entity_id} className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">{entity.entity_name}</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Total estimated: {formatCurrency(entity.quarters.reduce((s, q) => s + q.estimated_tax_cents, 0))}
                  {entity.entity_type === 'admin' && (
                    <span className="ml-2 text-blue-600 text-xs font-medium">
                      (contractor deductions included)
                    </span>
                  )}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quarter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        {selectedEntityType === 'partner' ? 'Commissions' : 'Revenue'}
                      </th>
                      {entity.entity_type === 'admin' && (
                        <>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Commissions Paid
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-blue-600 uppercase">
                            Contractor Exp.
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Taxable Net
                          </th>
                        </>
                      )}
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Est. Tax</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entity.quarters.map((quarter) => {
                      const taxableNet = Math.max(
                        0,
                        quarter.total_revenue_cents - quarter.total_commissions_cents - quarter.contractor_expense_cents
                      );
                      return (
                        <tr key={quarter.quarter} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-sm font-semibold text-[#2BB673] bg-green-50 rounded-full">
                              {quarter.quarter}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(quarter.start_date).toLocaleDateString()} – {new Date(quarter.end_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                            {formatCurrency(
                              selectedEntityType === 'partner'
                                ? quarter.total_commissions_cents
                                : quarter.total_revenue_cents
                            )}
                          </td>
                          {entity.entity_type === 'admin' && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">
                                –{formatCurrency(quarter.total_commissions_cents)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-700">
                                {quarter.contractor_expense_cents > 0
                                  ? `–${formatCurrency(quarter.contractor_expense_cents)}`
                                  : '—'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-800">
                                {formatCurrency(taxableNet)}
                              </td>
                            </>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                            {formatCurrency(quarter.estimated_tax_cents)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className={isDueSoon(quarter.payment_due_date) ? 'text-orange-600 font-medium' : 'text-gray-900'}>
                                {new Date(quarter.payment_due_date).toLocaleDateString()}
                              </span>
                              {isDueSoon(quarter.payment_due_date) && (
                                <span className="px-2 py-0.5 text-xs font-medium text-orange-600 bg-orange-100 rounded">
                                  Due Soon
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {estimates.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center border border-slate-200">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Data Available</h3>
            <p className="text-slate-500">
              No {selectedEntityType} activity found for {selectedYear}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
