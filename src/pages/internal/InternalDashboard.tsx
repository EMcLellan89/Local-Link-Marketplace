import { useEffect, useState } from 'react';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import {
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  LifeBuoy,
  Building2,
  ArrowUp,
  ArrowDown,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalSales: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  openTickets: number;
  businessUnits: number;
  quarterlyTaxableSales: number;
}

interface QuarterlyTaxInfo {
  quarter: string;
  quarterStart: Date;
  quarterEnd: Date;
  taxableSales: number;
  maSalesTax: number;
  federalIncomeTax: number;
  totalTaxOwed: number;
  paymentDeadline: Date;
}

interface RecentSale {
  id: string;
  customer_name: string;
  product_name: string;
  amount: number;
  sale_date: string;
  business_name: string;
}

export default function InternalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalSales: 0,
    monthlyRevenue: 0,
    pendingInvoices: 0,
    openTickets: 0,
    businessUnits: 0,
    quarterlyTaxableSales: 0,
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [quarterlyTax, setQuarterlyTax] = useState<QuarterlyTaxInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  function getCurrentQuarterInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    let quarter: number;
    let quarterStart: Date;
    let quarterEnd: Date;
    let paymentDeadline: Date;

    if (month < 3) {
      quarter = 1;
      quarterStart = new Date(year, 0, 1);
      quarterEnd = new Date(year, 2, 31);
      paymentDeadline = new Date(year, 3, 30);
    } else if (month < 6) {
      quarter = 2;
      quarterStart = new Date(year, 3, 1);
      quarterEnd = new Date(year, 5, 30);
      paymentDeadline = new Date(year, 6, 31);
    } else if (month < 9) {
      quarter = 3;
      quarterStart = new Date(year, 6, 1);
      quarterEnd = new Date(year, 8, 30);
      paymentDeadline = new Date(year, 9, 31);
    } else {
      quarter = 4;
      quarterStart = new Date(year, 9, 1);
      quarterEnd = new Date(year, 11, 31);
      paymentDeadline = new Date(year + 1, 0, 31);
    }

    return {
      quarter: `Q${quarter} ${year}`,
      quarterStart,
      quarterEnd,
      paymentDeadline,
    };
  }

  async function loadDashboardData() {
    try {
      const [
        customersData,
        salesData,
        invoicesData,
        ticketsData,
        businessesData,
        recentSalesData,
      ] = await Promise.all([
        supabase.from('unified_customers').select('id, status', { count: 'exact' }),
        supabase.from('unified_sales').select('amount, sale_date'),
        supabase.from('internal_invoices').select('id', { count: 'exact' }).in('status', ['sent', 'overdue']),
        supabase.from('customer_support_tickets').select('id', { count: 'exact' }).in('status', ['open', 'in_progress']),
        supabase.from('business_units').select('id', { count: 'exact' }).eq('is_active', true),
        supabase
          .from('unified_sales')
          .select(`
            id,
            product_name,
            amount,
            sale_date,
            unified_customers!unified_sales_customer_id_fkey (full_name, email),
            business_units (name)
          `)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const activeCustomers = customersData.data?.filter(c => c.status === 'active').length || 0;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = salesData.data
        ?.filter(sale => {
          const saleDate = new Date(sale.sale_date);
          return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        })
        .reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

      const totalSales = salesData.data?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

      const quarterInfo = getCurrentQuarterInfo();
      const quarterlyTaxableSales = salesData.data
        ?.filter(sale => {
          const saleDate = new Date(sale.sale_date);
          return saleDate >= quarterInfo.quarterStart && saleDate <= quarterInfo.quarterEnd;
        })
        .reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

      const MA_SALES_TAX_RATE = 0.0625;
      const FEDERAL_INCOME_TAX_RATE = 0.21;

      const maSalesTax = quarterlyTaxableSales * MA_SALES_TAX_RATE;
      const federalIncomeTax = quarterlyTaxableSales * FEDERAL_INCOME_TAX_RATE;
      const totalTaxOwed = maSalesTax + federalIncomeTax;

      setQuarterlyTax({
        quarter: quarterInfo.quarter,
        quarterStart: quarterInfo.quarterStart,
        quarterEnd: quarterInfo.quarterEnd,
        taxableSales: quarterlyTaxableSales,
        maSalesTax,
        federalIncomeTax,
        totalTaxOwed,
        paymentDeadline: quarterInfo.paymentDeadline,
      });

      setStats({
        totalCustomers: customersData.count || 0,
        activeCustomers,
        totalSales,
        monthlyRevenue,
        pendingInvoices: invoicesData.count || 0,
        openTickets: ticketsData.count || 0,
        businessUnits: businessesData.count || 0,
        quarterlyTaxableSales,
      });

      const formattedRecentSales = recentSalesData.data?.map(sale => ({
        id: sale.id,
        customer_name: (sale.unified_customers as any)?.full_name || (sale.unified_customers as any)?.email || 'Unknown',
        product_name: sale.product_name,
        amount: sale.amount,
        sale_date: sale.sale_date,
        business_name: (sale.business_units as any)?.name || 'Unknown',
      })) || [];

      setRecentSales(formattedRecentSales);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      subValue: `${stats.activeCustomers} active`,
      icon: Users,
      color: 'bg-blue-500',
      link: '/internal/customers',
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      subValue: 'This month',
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/internal/sales',
    },
    {
      label: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString()}`,
      subValue: 'All time',
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/internal/sales',
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoices.toString(),
      subValue: 'Awaiting payment',
      icon: FileText,
      color: 'bg-orange-500',
      link: '/internal/invoices',
    },
    {
      label: 'Open Tickets',
      value: stats.openTickets.toString(),
      subValue: 'Needs attention',
      icon: LifeBuoy,
      color: 'bg-red-500',
      link: '/internal/support',
    },
    {
      label: 'Business Units',
      value: stats.businessUnits.toString(),
      subValue: 'Active businesses',
      icon: Building2,
      color: 'bg-indigo-500',
      link: '/internal/businesses',
    },
  ];

  if (loading) {
    return (
      <InternalCRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </InternalCRMLayout>
    );
  }

  return (
    <InternalCRMLayout>
      <div className="space-y-8 mb-20">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening across all your businesses.</p>
        </div>

        {/* Quarterly Tax Obligations - Massachusetts */}
        {quarterlyTax && (
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Receipt className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Quarterly Tax Obligations - Massachusetts</h2>
                </div>
                <p className="text-sm text-gray-600">
                  {quarterlyTax.quarter} ({quarterlyTax.quarterStart.toLocaleDateString()} - {quarterlyTax.quarterEnd.toLocaleDateString()})
                </p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 rounded-full">
                <AlertCircle className="w-4 h-4 text-orange-700" />
                <span className="text-sm font-semibold text-orange-700">
                  Due: {quarterlyTax.paymentDeadline.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Taxable Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${quarterlyTax.taxableSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">MA State Sales Tax</p>
                <p className="text-xs text-gray-500 mb-1">(6.25%)</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${quarterlyTax.maSalesTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Federal Income Tax</p>
                <p className="text-xs text-gray-500 mb-1">(Est. 21%)</p>
                <p className="text-2xl font-bold text-green-600">
                  ${quarterlyTax.federalIncomeTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-orange-600 p-4 rounded-lg border border-orange-700">
                <p className="text-sm font-medium text-orange-100 mb-1">Total Tax Owed</p>
                <p className="text-xs text-orange-200 mb-1">Combined</p>
                <p className="text-2xl font-bold text-white">
                  ${quarterlyTax.totalTaxOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Payment Instructions:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>MA Sales Tax: Pay online at <a href="https://www.mass.gov/masstaxconnect" target="_blank" rel="noopener noreferrer" className="underline font-medium">MassTaxConnect</a></li>
                  <li>Federal Taxes: File Form 1040-ES or pay via <a href="https://www.irs.gov/payments" target="_blank" rel="noopener noreferrer" className="underline font-medium">IRS Direct Pay</a></li>
                  <li>Deadline: {quarterlyTax.paymentDeadline.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.link}>
                <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.subValue}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Sales */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
            <Link to="/internal/sales" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Business</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No recent sales found
                    </td>
                  </tr>
                ) : (
                  recentSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900">{sale.customer_name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">{sale.product_name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sale.business_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ${Number(sale.amount).toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </InternalCRMLayout>
  );
}
