import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Sparkles, Loader, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface PromptRow {
  id: string;
  title: string;
  intent: string;
  prompt_template: string;
  example_input: Record<string, string>;
  category_id: string;
  prompt_categories?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function AIPromptsPage() {
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selected, setSelected] = useState<PromptRow | null>(null);
  const [inputJson, setInputJson] = useState('{}');
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrompts();
    loadCredits();
  }, []);

  async function loadPrompts() {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('Please sign in to access AI prompts');
        setLoading(false);
        return;
      }

      const { data: cats, error: catsError } = await supabase
        .from('prompt_categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (catsError) {
        console.error('Error loading categories:', catsError);
        setError(`Categories error: ${catsError.message}`);
      } else {
        setCategories((cats ?? []) as Category[]);
      }

      const { data, error: promptsError } = await supabase
        .from('prompts')
        .select(`
          id,
          title,
          intent,
          prompt_template,
          example_input,
          category_id,
          prompt_categories (
            name
          )
        `)
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (promptsError) {
        console.error('Error loading prompts:', promptsError);
        setError(`Prompts error: ${promptsError.message}`);
      } else {
        setPrompts((data ?? []) as PromptRow[]);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadCredits() {
    const { data } = await supabase.rpc('get_my_credit_balance');
    setCredits(Number(data ?? 0));
  }

  async function runPrompt() {
    if (!selected) return;
    setBusy(true);
    setOutput('');

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(inputJson);
    } catch {
      setOutput('❌ Input must be valid JSON.');
      setBusy(false);
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) {
      setOutput('❌ Please sign in.');
      setBusy(false);
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const resp = await fetch(`${supabaseUrl}/functions/v1/run-prompt`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ promptId: selected.id, input: parsed })
    });

    const json = await resp.json();
    if (!resp.ok) {
      setOutput(`❌ ${json?.error ?? 'Error'}\n${json?.details ?? ''}`);
    } else {
      setOutput(json.output ?? '');
      await loadCredits();
    }

    setBusy(false);
  }

  const filteredPrompts = selectedCategory === 'all'
    ? prompts
    : prompts.filter(p => p.category_id === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading AI Prompt Library...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mb-4">
          <BackButton />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-900">Error loading prompts</div>
                <div className="text-sm text-red-700 mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                AI Prompt Library
              </h1>
              <p className="text-slate-600">
                Generate outreach scripts, emails, and offers tailored to local businesses
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">AI Credits</div>
              <div className="text-2xl font-bold text-slate-900">{credits}</div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Prompts
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Choose a Prompt
              </h2>
              <div className="space-y-2">
                {filteredPrompts.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No prompts found
                  </div>
                ) : (
                  filteredPrompts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelected(p);
                        setInputJson(JSON.stringify(p.example_input ?? {}, null, 2));
                        setOutput('');
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selected?.id === p.id
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-medium text-slate-900 text-sm mb-1">{p.title}</div>
                      <div className="text-xs text-slate-600">{p.intent}</div>
                      {p.prompt_categories && (
                        <div className="text-xs text-slate-500 mt-1">{p.prompt_categories.name}</div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            {!selected ? (
              <Card className="p-12 text-center">
                <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a prompt to get started</h3>
                <p className="text-slate-600">
                  Choose any prompt from the library to generate AI-powered content
                </p>
              </Card>
            ) : (
              <>
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">Selected Prompt</h2>
                  <p className="text-sm text-slate-600 mb-4">{selected.title}</p>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs font-medium text-slate-700 mb-2">Template:</div>
                    <pre className="text-xs whitespace-pre-wrap text-slate-600 max-h-40 overflow-auto">
                      {selected.prompt_template}
                    </pre>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">Input Variables (JSON)</h2>
                  <p className="text-sm text-slate-600 mb-4">
                    Customize the variables below to personalize your prompt
                  </p>
                  <textarea
                    className="w-full border border-slate-300 rounded-lg p-4 font-mono text-sm min-h-[200px] focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    value={inputJson}
                    onChange={(e) => setInputJson(e.target.value)}
                    placeholder='{"business_name": "Example Business", "city": "Boston"}'
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Cost: <span className="font-semibold text-slate-900">1 credit</span>
                    </div>
                    <Button
                      onClick={runPrompt}
                      disabled={!selected || busy || credits <= 0}
                    >
                      {busy ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Run Prompt
                        </>
                      )}
                    </Button>
                  </div>
                  {credits <= 0 && (
                    <div className="mt-4 flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <div className="font-medium mb-1">No credits available</div>
                        <div>Contact support to purchase more AI credits</div>
                      </div>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Output</h2>
                  {output ? (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <pre className="text-sm whitespace-pre-wrap text-slate-700">
                        {output}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      Output will appear here after running the prompt
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
