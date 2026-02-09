import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseBrowser } from '../../lib/supabase-browser';
import { requireOrgId } from '../../lib/org';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ExecCase {
  id: string;
  status: string;
  created_at: string;
  exec_products: {
    name: string;
    product_key: string;
  };
}

export default function ExecCasesListPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<ExecCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      const orgId = requireOrgId();

      const { data, error } = await supabaseBrowser
        .from('exec_cases')
        .select('id, status, created_at, exec_products(name, product_key)')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'applied':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading cases...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Executive Solutions
          </h1>
          <Button onClick={() => navigate(`/merchant/executive-solutions?org_id=${requireOrgId()}`)}>
            Browse Solutions
          </Button>
        </div>

        {cases.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No executive solutions purchased yet.</p>
            <Button onClick={() => navigate(`/merchant/executive-solutions?org_id=${requireOrgId()}`)}>
              Browse Solutions
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cases.map((execCase) => (
              <Card
                key={execCase.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/exec/cases/${execCase.id}?org_id=${requireOrgId()}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {(execCase.exec_products as any)?.name || 'Unknown Product'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created {new Date(execCase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(execCase.status)}`}>
                      {execCase.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
