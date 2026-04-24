import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { DollarSign, CreditCard as Edit2, ToggleLeft, ToggleRight, Plus, RefreshCw, X, Save, Check } from "lucide-react";

type Rule = {
  id: string;
  product_code: string;
  product_name: string;
  rate: number;
  recurring: boolean;
  first_month_only: boolean;
  override_allowed: boolean;
  override_rate: number | null;
  refund_hold_days: number;
  active: boolean;
};

const EMPTY_RULE: Omit<Rule, "id"> = {
  product_code: "",
  product_name: "",
  rate: 0.30,
  recurring: false,
  first_month_only: false,
  override_allowed: false,
  override_rate: null,
  refund_hold_days: 30,
  active: true,
};

function pct(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

export default function AdminCommissionRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Rule>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Omit<Rule, "id">>({ ...EMPTY_RULE });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRules(); }, []);

  async function loadRules() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("commission_rule_engine")
        .select("*")
        .order("product_code");
      if (data) setRules(data as Rule[]);
    } finally {
      setLoading(false);
    }
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("commission_rule_engine")
        .update({ ...editForm, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (!error && data) {
        setRules(prev => prev.map(r => r.id === id ? data as Rule : r));
        setEditId(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(rule: Rule) {
    const { data, error } = await supabase
      .from("commission_rule_engine")
      .update({ active: !rule.active })
      .eq("id", rule.id)
      .select()
      .maybeSingle();
    if (!error && data) setRules(prev => prev.map(r => r.id === rule.id ? data as Rule : r));
  }

  async function addRule() {
    if (!addForm.product_code || !addForm.product_name) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("commission_rule_engine")
        .insert({ ...addForm })
        .select()
        .maybeSingle();
      if (!error && data) {
        setRules(prev => [...prev, data as Rule]);
        setShowAdd(false);
        setAddForm({ ...EMPTY_RULE });
      }
    } finally {
      setSaving(false);
    }
  }

  const RuleFormFields = ({
    form, setForm
  }: { form: Partial<Rule>; setForm: (f: Partial<Rule>) => void }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Rate (%)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={form.rate !== undefined ? (form.rate * 100).toFixed(1) : ""}
          onChange={e => setForm({ ...form, rate: parseFloat(e.target.value) / 100 })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Override Rate (%)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={form.override_rate !== undefined && form.override_rate !== null ? (form.override_rate * 100).toFixed(1) : ""}
          onChange={e => setForm({ ...form, override_rate: e.target.value ? parseFloat(e.target.value) / 100 : null })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="None"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Hold Days</label>
        <input
          type="number"
          min="0"
          value={form.refund_hold_days ?? 30}
          onChange={e => setForm({ ...form, refund_hold_days: parseInt(e.target.value) })}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">Flags</label>
        <div className="flex flex-col gap-1">
          {([
            ["recurring", "Recurring"] as const,
            ["first_month_only", "First Month Only"] as const,
            ["override_allowed", "Override Allowed"] as const,
          ]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!(form as any)[key]}
                onChange={e => setForm({ ...form, [key]: e.target.checked })}
                className="accent-blue-600"
              />
              <span className="text-xs text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Rules Engine</h1>
          <p className="text-gray-500 text-sm mt-0.5">Per-product commission rates, recurring flags, and hold periods.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadRules} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Rule
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">New Commission Rule</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Code</label>
              <input
                type="text"
                value={addForm.product_code}
                onChange={e => setAddForm(f => ({ ...f, product_code: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="merchant_starter"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
              <input
                type="text"
                value={addForm.product_name}
                onChange={e => setAddForm(f => ({ ...f, product_name: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Merchant Starter Plan"
              />
            </div>
          </div>
          <RuleFormFields form={addForm} setForm={f => setAddForm(f as Omit<Rule, "id">)} />
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAdd(false); setAddForm({ ...EMPTY_RULE }); }}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={addRule}
              disabled={!addForm.product_code || !addForm.product_name || saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Add Rule"}
            </button>
          </div>
        </div>
      )}

      {/* Rules table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">Product</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Override</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Recurring</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">1st Mo Only</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Hold Days</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600">Active</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rules.map(rule => (
                  <tr key={rule.id} className={`hover:bg-gray-50 ${!rule.active ? "opacity-50" : ""}`}>
                    {editId === rule.id ? (
                      <>
                        <td className="px-4 py-3 font-medium text-sm text-gray-900">
                          <div>
                            <p className="font-semibold">{rule.product_code}</p>
                            <p className="text-xs text-gray-500">{rule.product_name}</p>
                          </div>
                        </td>
                        <td colSpan={5} className="px-4 py-3">
                          <RuleFormFields form={editForm} setForm={setEditForm} />
                        </td>
                        <td />
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveEdit(rule.id)}
                              disabled={saving}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                              <Save className="w-3 h-3" /> Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-gray-900">{rule.product_code}</p>
                          <p className="text-xs text-gray-500">{rule.product_name}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{pct(rule.rate)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          {rule.override_allowed && rule.override_rate != null ? pct(rule.override_rate) : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {rule.recurring ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {rule.first_month_only ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">{rule.refund_hold_days}d</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleActive(rule)} className="text-gray-400 hover:text-gray-700">
                            {rule.active
                              ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                              : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => { setEditId(rule.id); setEditForm({ rate: rule.rate, recurring: rule.recurring, first_month_only: rule.first_month_only, override_allowed: rule.override_allowed, override_rate: rule.override_rate, refund_hold_days: rule.refund_hold_days }); }}
                              className="flex items-center gap-1 px-3 py-1 border border-gray-200 text-gray-600 rounded text-xs font-medium hover:bg-gray-50"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">No rules configured.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
