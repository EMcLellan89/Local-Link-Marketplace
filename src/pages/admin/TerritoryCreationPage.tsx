import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { MapPin, Plus } from 'lucide-react';
import { US_STATES } from '../../lib/usStatesCounties';

export default function TerritoryCreationPage() {
  const [territoryName, setTerritoryName] = useState('');
  const [territoryType, setTerritoryType] = useState('County');
  const [selectedState, setSelectedState] = useState('');
  const [countyName, setCountyName] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [languageCode, setLanguageCode] = useState('en');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/territory-create`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          territory_name: territoryName,
          territory_type: territoryType,
          country_code: countryCode,
          currency_code: currencyCode,
          language_code: languageCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create territory' }));
        throw new Error(errorData.error || 'Failed to create territory');
      }

      setSuccess('Territory created successfully!');
      setTerritoryName('');

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
          <BackButton />
        </div>
        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Territory</h1>
        <p className="text-gray-600">
          Add new territories for global rollout and partner assignments.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Territory Details
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    if (territoryType === 'State') {
                      const state = US_STATES.find(s => s.abbr === e.target.value);
                      if (state) setTerritoryName(state.name);
                    }
                  }}
                  disabled={submitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state.abbr} value={state.abbr}>
                      {state.name} ({state.abbr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Territory Type *
                </label>
                <select
                  value={territoryType}
                  onChange={(e) => {
                    setTerritoryType(e.target.value);
                    if (e.target.value === 'State' && selectedState) {
                      const state = US_STATES.find(s => s.abbr === selectedState);
                      if (state) setTerritoryName(state.name);
                    }
                  }}
                  disabled={submitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="County">County</option>
                  <option value="City">City</option>
                  <option value="Metro">Metro</option>
                  <option value="Region">Region</option>
                  <option value="State">State</option>
                </select>
              </div>
            </div>

            {territoryType === 'County' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Los Angeles County"
                  value={countyName}
                  onChange={(e) => {
                    setCountyName(e.target.value);
                    const state = US_STATES.find(s => s.abbr === selectedState);
                    if (state && e.target.value) {
                      setTerritoryName(`${e.target.value}, ${state.abbr}`);
                    }
                  }}
                  disabled={submitting}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Territory Name *
              </label>
              <Input
                type="text"
                placeholder="Auto-filled or custom name"
                value={territoryName}
                onChange={(e) => setTerritoryName(e.target.value)}
                disabled={submitting}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Name is auto-generated based on type. Edit if needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country Code *
                </label>
                <Input
                  type="text"
                  placeholder="US"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                  disabled={submitting}
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Code *
                </label>
                <Input
                  type="text"
                  placeholder="USD"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())}
                  disabled={submitting}
                  maxLength={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language Code *
                </label>
                <Input
                  type="text"
                  placeholder="en"
                  value={languageCode}
                  onChange={(e) => setLanguageCode(e.target.value.toLowerCase())}
                  disabled={submitting}
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || !territoryName.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {submitting ? 'Creating...' : 'Create Territory'}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Territory Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select a state first, then choose territory type</li>
            <li>• For Counties: Enter the county name (e.g., "Los Angeles County")</li>
            <li>• For Cities/Metro: Territory name auto-fills but can be edited</li>
            <li>• For States: Entire state becomes the territory</li>
            <li>• New territories start in "Available" status</li>
            <li>• Territories can be assigned to partners after creation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
