import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Tag,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  X,
  Package,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type OfferType = 'service' | 'product' | 'event' | 'bundle' | 'subscription';

interface Offer {
  id: string;
  name: string;
  type: OfferType;
  price_cents: number;
  description: string;
  is_active: boolean;
  bookings_count: number;
}

interface NewOfferForm {
  name: string;
  type: OfferType;
  price_dollars: string;
  description: string;
  is_active: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_OFFERS: Offer[] = [
  { id: '1', name: 'Website Redesign', type: 'service', price_cents: 180000, description: 'Full website redesign including 5 pages, mobile responsive', is_active: true, bookings_count: 8 },
  { id: '2', name: 'Monthly Retainer', type: 'subscription', price_cents: 59900, description: 'Monthly marketing and maintenance retainer', is_active: true, bookings_count: 12 },
  { id: '3', name: 'SEO Starter Package', type: 'bundle', price_cents: 96000, description: '3-month SEO campaign with monthly reports', is_active: true, bookings_count: 5 },
  { id: '4', name: 'Logo Design', type: 'service', price_cents: 45000, description: 'Custom logo design with 3 revisions', is_active: true, bookings_count: 15 },
  { id: '5', name: 'Spring Workshop Ticket', type: 'event', price_cents: 9500, description: 'Half-day business growth workshop', is_active: true, bookings_count: 24 },
  { id: '6', name: 'Business Cards (500)', type: 'product', price_cents: 7500, description: 'Premium business cards, full color both sides', is_active: true, bookings_count: 32 },
  { id: '7', name: 'Social Media Management', type: 'subscription', price_cents: 79900, description: 'Monthly social media content and scheduling', is_active: false, bookings_count: 3 },
  { id: '8', name: 'Email Campaign Setup', type: 'service', price_cents: 32000, description: 'Full email drip campaign setup and automation', is_active: true, bookings_count: 9 },
  { id: '9', name: 'Branding Bundle', type: 'bundle', price_cents: 245000, description: 'Logo + business cards + website = complete brand kit', is_active: true, bookings_count: 4 },
  { id: '10', name: 'Consulting Hour', type: 'service', price_cents: 19500, description: '1-hour one-on-one business consulting session', is_active: true, bookings_count: 41 },
  { id: '11', name: 'Quarterly Review', type: 'event', price_cents: 0, description: 'Free quarterly business health check', is_active: true, bookings_count: 18 },
  { id: '12', name: 'Postcard Mailing (100)', type: 'product', price_cents: 22500, description: '100 custom postcards printed and mailed', is_active: true, bookings_count: 7 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (cents: number): string => {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
};

const TYPE_LABELS: Record<OfferType, string> = {
  service: 'Service',
  product: 'Product',
  event: 'Event',
  bundle: 'Bundle',
  subscription: 'Subscription',
};

const TYPE_COLORS: Record<OfferType, string> = {
  service: 'bg-blue-100 text-blue-700',
  product: 'bg-slate-100 text-slate-700',
  event: 'bg-green-100 text-green-700',
  bundle: 'bg-amber-100 text-amber-700',
  subscription: 'bg-rose-100 text-rose-700',
};

type FilterTab = 'all' | OfferType;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'service', label: 'Services' },
  { key: 'product', label: 'Products' },
  { key: 'event', label: 'Events' },
  { key: 'bundle', label: 'Bundles' },
  { key: 'subscription', label: 'Subscriptions' },
];

const BRAND = '#2BB673';

// ─── Add Offer Modal ──────────────────────────────────────────────────────────

interface AddOfferModalProps {
  onClose: () => void;
  onAdd: (offer: Offer) => void;
}

const EMPTY_FORM: NewOfferForm = {
  name: '',
  type: 'service',
  price_dollars: '',
  description: '',
  is_active: true,
};

function AddOfferModal({ onClose, onAdd }: AddOfferModalProps) {
  const [form, setForm] = useState<NewOfferForm>(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price_cents = Math.round(parseFloat(form.price_dollars || '0') * 100);
    const newOffer: Offer = {
      id: String(Date.now()),
      name: form.name.trim(),
      type: form.type,
      price_cents,
      description: form.description.trim(),
      is_active: form.is_active,
      bookings_count: 0,
    };
    onAdd(newOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Add New Offer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
              placeholder="e.g. Logo Design"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as OfferType })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
            >
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price_dollars}
                onChange={(e) => setForm({ ...form, price_dollars: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673] focus:border-transparent resize-none"
              placeholder="Short description of this offer..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              {form.is_active ? (
                <ToggleRight size={22} style={{ color: BRAND }} />
              ) : (
                <ToggleLeft size={22} className="text-gray-400" />
              )}
              {form.is_active ? 'Active' : 'Inactive'}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-white rounded-lg py-2 text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: BRAND }}
            >
              Add Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CRMOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load offers from Supabase, fall back to mock data
  useEffect(() => {
    const fetchOffers = async () => {
      if (!user) {
        setOffers(MOCK_OFFERS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('crm_offers')
          .select('*')
          .eq('merchant_id', user.id)
          .order('name');

        if (error || !data || data.length === 0) {
          setOffers(MOCK_OFFERS);
        } else {
          setOffers(data as Offer[]);
        }
      } catch {
        setOffers(MOCK_OFFERS);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [user]);

  // Filtered offers based on tab
  const filteredOffers = activeTab === 'all'
    ? offers
    : offers.filter((o) => o.type === activeTab);

  // Stats
  const totalOffers = offers.length;
  const activeOffers = offers.filter((o) => o.is_active).length;
  const activeWithPrice = offers.filter((o) => o.is_active && o.price_cents > 0);
  const avgPrice = activeWithPrice.length > 0
    ? activeWithPrice.reduce((sum, o) => sum + o.price_cents, 0) / activeWithPrice.length
    : 0;
  const topSeller = offers.reduce<Offer | null>((best, o) =>
    !best || o.bookings_count > best.bookings_count ? o : best, null);

  // Toggle active state (optimistic)
  const handleToggleActive = async (offerId: string) => {
    const prev = offers.find((o) => o.id === offerId);
    if (!prev) return;

    const newValue = !prev.is_active;

    // Optimistic update
    setOffers((current) =>
      current.map((o) => (o.id === offerId ? { ...o, is_active: newValue } : o))
    );

    // Attempt Supabase update
    try {
      await supabase
        .from('crm_offers')
        .update({ is_active: newValue })
        .eq('id', offerId);
    } catch {
      // Revert on failure
      setOffers((current) =>
        current.map((o) => (o.id === offerId ? { ...o, is_active: prev.is_active } : o))
      );
    }
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers((current) => current.filter((o) => o.id !== offerId));
  };

  const handleAddOffer = (offer: Offer) => {
    setOffers((current) => [offer, ...current]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          to="/merchant/crm"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          CRM Hub
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offers &amp; Pricing</h1>
            <p className="text-sm text-gray-500 mt-0.5">Your complete product and service catalog</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: BRAND }}
          >
            <Plus size={16} />
            Add Offer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Total Offers</p>
            <p className="text-2xl font-bold text-gray-900">{totalOffers}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Active</p>
            <p className="text-2xl font-bold" style={{ color: BRAND }}>{activeOffers}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Avg Price</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(Math.round(avgPrice))}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Top Seller</p>
            <p className="text-base font-semibold text-gray-900 truncate">
              {topSeller ? topSeller.name : '—'}
            </p>
            {topSeller && (
              <p className="text-xs text-gray-400">{topSeller.bookings_count} bookings</p>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offer grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3 opacity-40" />
            <p className="text-sm">No offers found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Type badge + actions */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[offer.type]}`}
                  >
                    <Tag size={11} />
                    {TYPE_LABELS[offer.type]}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      title="Edit offer"
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      title="Delete offer"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors rounded-md hover:bg-rose-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Name + price */}
                <div>
                  <h3 className="font-semibold text-gray-900 leading-snug">{offer.name}</h3>
                  <p className="text-xl font-bold mt-0.5" style={{ color: BRAND }}>
                    {formatPrice(offer.price_cents)}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{offer.description}</p>

                {/* Footer: bookings + toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {offer.bookings_count} bookings
                  </span>
                  <button
                    onClick={() => handleToggleActive(offer.id)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: offer.is_active ? BRAND : '#9ca3af' }}
                    title={offer.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {offer.is_active ? (
                      <ToggleRight size={20} style={{ color: BRAND }} />
                    ) : (
                      <ToggleLeft size={20} className="text-gray-400" />
                    )}
                    {offer.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddOfferModal onClose={() => setShowAddModal(false)} onAdd={handleAddOffer} />
      )}
    </DashboardLayout>
  );
}
