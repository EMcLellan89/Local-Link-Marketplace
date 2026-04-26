import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, DollarSign, Download, TrendingUp, AlertCircle } from 'lucide-react';

interface QuarterEstimate {
  quarter: string;
  year: number;
  start_date: string;
  end_date: string;
  total_revenue_cents: number;
  total_commissions_cents: number;
  estimated_tax_cents: number;
  payment_due_date: string;
}

interface EntityEstimates {
  entity_type: 'admin' | 'partner' | 'merchant';
  entity_id: string;
  entity_name: string;
  quarters: QuarterEstimate[];
}

export default function QuarterlyTaxEstimatesPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEntityType, setSelectedEntityType] = useState<'admin' | 'partner' | 'merchant'>('partner');
  const [estimates, setEstimates] = useState<EntityEstimates[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuarterlyEstimates();
  }, [selectedYear, selectedEntityType]);

  const getQuarterDates = (year: number, quarter: number): { start: Date; end: Date; dueDate: Date } => {
    const quarters = [
      { start: new Date(year, 0, 1), end: new Date(year, 2, 31), dueDate: new Date(year, 3, 15) }, // Q1: Apr 15
      { start: new Date(year, 3, 1), end: new Date(year, 5, 30), dueDate: new Date(year, 5, 15) }, // Q2: Jun 15
      { start: new Date(year, 6, 1), end: new Date(year, 8, 30), dueDate: new Date(year, 8, 15) }, // Q3: Sep 15
      { start: new Date(year, 9, 1), end: new Date(year, 11, 31), dueDate: new Date(year + 1, 0, 15) }, // Q4: Jan 15
    ];
    return quarters[quarter - 1];
  };

  const fetchQuarterlyEstimates = async () => {
    try {
      setLoading(true);

      const allEstimates: EntityEstimates[] = [];

      if (selectedEntityType === 'partner') {
        // Fetch partner earnings by quarter
        const { data: partners, error: partnersError } = await supabase
          .from('partners')
          .select('id, full_name')
          .eq('is_active', true);

        if (partnersError) throw partnersError;

        for (const partner of partners || []) {
          const quarters: QuarterEstimate[] = [];

          for (let q = 1; q <= 4; q++) {
            const { start, end, dueDate } = getQuarterDates(selectedYear, q);

            const { data: earnings, error: earningsError } = await supabase
              .from('partner_earnings')
              .select('amount_cents, sales_ledger!inner(amount_cents)')
              .eq('partner_id', partner.id)
              .eq('status', 'paid')
              .gte('created_at', start.toISOString())
              .lte('created_at', end.toISOString());

            if (earningsError) throw earningsError;

            const totalCommissions = earnings?.reduce((sum, e) => sum + e.amount_cents, 0) || 0;
            const totalRevenue = earnings?.reduce((sum, e) => sum + (e.sales_ledger?.amount_cents || 0), 0) || 0;

            // Estimated self-employment tax: 15.3% SE tax + 22% federal (average) = ~37%
            const estimatedTax = Math.round(totalCommissions * 0.37);

            if (totalCommissions > 0) {
              quarters.push({
                quarter: `Q${q}`,
                year: selectedYear,
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
                total_revenue_cents: totalRevenue,
                total_commissions_cents: totalCommissions,
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
        // Fetch merchant revenue by quarter
        const { data: merchants, error: merchantsError } = await supabase
          .from('merchants')
          .select('id, business_name')
          .eq('is_active', true);

        if (merchantsError) throw merchantsError;

        for (const merchant of merchants || []) {
          const quarters: QuarterEstimate[] = [];

          for (let q = 1; q <= 4; q++) {
            const { start, end, dueDate } = getQuarterDates(selectedYear, q);

            const { data: orders, error: ordersError } = await supabase
              .from('merchant_orders')
              .select('total_amount')
              .eq('merchant_id', merchant.id)
              .eq('status', 'completed')
              .gte('created_at', start.toISOString())
              .lte('created_at', end.toISOString());

            if (ordersError) throw ordersError;

            const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;

            // Merchant tax estimate: 25% (simplified)
            const estimatedTax = Math.round(totalRevenue * 0.25);

            if (totalRevenue > 0) {
              quarters.push({
                quarter: `Q${q}`,
                year: selectedYear,
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
                total_revenue_cents: totalRevenue,
                total_commissions_cents: 0,
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
        // Admin = Platform revenue (all sales minus commissions)
        const quarters: QuarterEstimate[] = [];

        for (let q = 1; q <= 4; q++) {
          const { start, end, dueDate } = getQuarterDates(selectedYear, q);

          const { data: sales, error: salesError } = await supabase
            .from('sales_ledger')
            .select('amount_cents')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());

          if (salesError) throw salesError;

          const { data: commissions, error: commissionsError } = await supabase
            .from('partner_earnings')
            .select('amount_cents')
            .eq('status', 'paid')
            .gte('created_at', start.toISOString())
            .lte('created_at', end.toISOString());

          if (commissionsError) throw commissionsError;

          const totalRevenue = sales?.reduce((sum, s) => sum + s.amount_cents, 0) || 0;
          const totalCommissions = commissions?.reduce((sum, c) => sum + c.amount_cents, 0) || 0;
          const netRevenue = totalRevenue - totalCommissions;

          // Corporate tax estimate: 21% federal
          const estimatedTax = Math.round(netRevenue * 0.21);

          if (netRevenue > 0) {
            quarters.push({
              quarter: `Q${q}`,
              year: selectedYear,
              start_date: start.toISOString().split('T')[0],
              end_date: end.toISOString().split('T')[0],
              total_revenue_cents: totalRevenue,
              total_commissions_cents: totalCommissions,
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

      // Sort by total commissions/revenue descending
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

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quarterly_tax_estimates_${selectedYear}_${selectedEntityType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue > 0 && daysUntilDue <= 30;
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quarterly Tax Estimates</h1>
          <p className="mt-2 text-gray-600">Track estimated tax payments for partners, merchants, and platform</p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Tax Disclaimer</p>
              <p className="mt-1">
                These are estimates only. Consult with a CPA or tax professional for accurate tax calculations.
                Actual tax liability may vary based on deductions, credits, and individual circumstances.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Entity Type */}
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setSelectedEntityType('partner')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedEntityType === 'partner'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Partners
              </button>
              <button
                onClick={() => setSelectedEntityType('merchant')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedEntityType === 'merchant'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Merchants
              </button>
              <button
                onClick={() => setSelectedEntityType('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedEntityType === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Platform
              </button>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Total {selectedYear} Estimated Tax Liability
              </p>
              <p className="text-4xl font-bold mt-2">
                {formatCurrency(yearTotal)}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {estimates.length} {selectedEntityType}(s) • All quarters
              </p>
            </div>
            <div className="p-4 bg-white/20 rounded-lg">
              <TrendingUp className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Estimates List */}
        <div className="space-y-6">
          {estimates.map((entity) => (
            <div key={entity.entity_id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{entity.entity_name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Total estimated: {formatCurrency(
                    entity.quarters.reduce((sum, q) => sum + q.estimated_tax_cents, 0)
                  )}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quarter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Period
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        {selectedEntityType === 'partner' ? 'Commissions' : 'Revenue'}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Estimated Tax
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entity.quarters.map((quarter) => (
                      <tr key={quarter.quarter} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                            {quarter.quarter}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(quarter.start_date).toLocaleDateString()} - {new Date(quarter.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatCurrency(
                            selectedEntityType === 'partner'
                              ? quarter.total_commissions_cents
                              : quarter.total_revenue_cents
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                          {formatCurrency(quarter.estimated_tax_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className={isDueSoon(quarter.payment_due_date) ? 'text-orange-600 font-medium' : 'text-gray-900'}>
                              {new Date(quarter.payment_due_date).toLocaleDateString()}
                            </span>
                            {isDueSoon(quarter.payment_due_date) && (
                              <span className="px-2 py-1 text-xs font-medium text-orange-600 bg-orange-100 rounded">
                                Due Soon
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {estimates.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              No {selectedEntityType} activity found for {selectedYear}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
