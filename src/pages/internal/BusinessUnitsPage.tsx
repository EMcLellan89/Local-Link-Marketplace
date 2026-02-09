import { useEffect, useState } from 'react';
import { InternalCRMLayout } from '../../components/layout/InternalCRMLayout';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import BackButton from '../../components/ui/BackButton';
import { Building2, Users, DollarSign } from 'lucide-react';

interface BusinessUnit {
  id: string;
  name: string;
  domain: string;
  business_type: string;
  is_active: boolean;
  created_at: string;
}

export default function BusinessUnitsPage() {
  const [businesses, setBusinesses] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    try {
      const { data, error } = await supabase
        .from('business_units')
        .select('*')
        .order('name');

      if (error) throw error;

      setBusinesses(data || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      crm: 'bg-blue-100 text-blue-800',
      marketplace: 'bg-purple-100 text-purple-800',
      saas: 'bg-green-100 text-green-800',
      service: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <InternalCRMLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        </div>
      </InternalCRMLayout>
    );
  }

  return (
    <InternalCRMLayout>
      <div className="space-y-6 mb-20">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Units</h1>
          <p className="text-gray-600">All business entities in your portfolio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(business.business_type)}`}>
                  {business.business_type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{business.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{business.domain}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>$0</span>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${business.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </InternalCRMLayout>
  );
}
