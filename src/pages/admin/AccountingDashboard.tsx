import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
  Calculator,
  CheckCircle
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  pending_tax_obligations: number;
  total_tax_due_cents: number;
  active_employees: number;
  partners_for_1099: number;
  ytd_payroll_cents: number;
}

interface TaxObligation {
  id: string;
  tax_type: string;
  tax_authority: string;
  due_date: string;
  estimated_amount_cents: number;
  status: string;
}

interface QuarterlyTax {
  quarter: number;
  year: number;
  total_revenue_cents: number;
  federal_tax_cents: number;
  state_tax_cents: number;
  total_tax_cents: number;
}

export default function AccountingDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingTaxes, setUpcomingTaxes] = useState<TaxObligation[]>([]);
  const [currentQuarter, setCurrentQuarter] = useState<QuarterlyTax | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsResult, taxesResult] = await Promise.all([
        supabase.rpc('get_accounting_dashboard_stats'),
        supabase
          .from('accounting_tax_obligations')
          .select('*')
          .eq('status', 'pending')
          .gte('due_date', new Date().toISOString().split('T')[0])
          .order('due_date', { ascending: true })
          .limit(5)
      ]);

      if (statsResult.data) setStats(statsResult.data);
      if (taxesResult.data) setUpcomingTaxes(taxesResult.data);

      const quarter = Math.floor((new Date().getMonth() / 3)) + 1;
      const year = new Date().getFullYear();

      const quarterResult = await supabase.rpc('calculate_quarterly_taxes', {
        p_year: year,
        p_quarter: quarter
      });

      if (quarterResult.data) setCurrentQuarter(quarterResult.data);

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(cents: number): string {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-2">Accounting Dashboard</h1>
          <p className="text-green-100">Tax tracking, payroll management, and 1099 generation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Tax Obligations</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.pending_tax_obligations || 0}</p>
                  <Link to="/admin/accounting/taxes" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    View all
                  </Link>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tax Due</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(stats?.total_tax_due_cents || 0)}
                  </p>
                  <Link to="/admin/accounting/taxes" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Pay taxes
                  </Link>
                </div>
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.active_employees || 0}</p>
                  <Link to="/admin/accounting/payroll" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Manage payroll
                  </Link>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Partners for 1099</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.partners_for_1099 || 0}</p>
                  <Link to="/admin/accounting/1099" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                    Generate 1099s
                  </Link>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/admin/accounting/taxes">
                <Button variant="primary" className="w-full justify-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Taxes
                </Button>
              </Link>
              <Link to="/admin/accounting/payroll">
                <Button variant="secondary" className="w-full justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  Process Payroll
                </Button>
              </Link>
              <Link to="/admin/accounting/1099">
                <Button variant="secondary" className="w-full justify-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Generate 1099s
                </Button>
              </Link>
              <Link to="/admin/accounting/accountants">
                <Button variant="secondary" className="w-full justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  Manage Accountants
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Upcoming Tax Deadlines</h2>
                </div>
                <Link to="/admin/accounting/taxes">
                  <Button variant="secondary" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {upcomingTaxes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p>No pending tax obligations</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTaxes.map((tax) => (
                    <div key={tax.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{tax.tax_type}</h3>
                          <p className="text-sm text-gray-600">{tax.tax_authority}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(tax.estimated_amount_cents)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(tax.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Current Quarter Tax Estimate</h2>
              </div>
            </CardHeader>
            <CardBody>
              {currentQuarter ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Q{currentQuarter.quarter} {currentQuarter.year}</span>
                    <span className="font-semibold text-gray-900">Tax Period</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(currentQuarter.total_revenue_cents)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Federal Tax (21%)</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(currentQuarter.federal_tax_cents)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">State Tax (7%)</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(currentQuarter.state_tax_cents)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Total Tax Due</span>
                      <span className="font-bold text-2xl text-red-600">
                        {formatCurrency(currentQuarter.total_tax_cents)}
                      </span>
                    </div>
                  </div>
                  <Link to="/admin/accounting/taxes">
                    <Button variant="primary" className="w-full mt-4">
                      Pay Quarterly Taxes
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No tax data available</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/accounting/taxes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Tax Management</h3>
                  <p className="text-sm text-gray-600">Track and pay federal and state taxes</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/admin/accounting/payroll">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Employee Payroll</h3>
                  <p className="text-sm text-gray-600">Manage employee payments and records</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {formatCurrency(stats?.ytd_payroll_cents || 0)}
                  </p>
                  <p className="text-xs text-gray-500">YTD Payroll</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link to="/admin/accounting/1099">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody>
                <div className="text-center py-4">
                  <FileText className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Partner 1099s</h3>
                  <p className="text-sm text-gray-600">Generate and send 1099 forms</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {stats?.partners_for_1099 || 0}
                  </p>
                  <p className="text-xs text-gray-500">Partners Ready</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
