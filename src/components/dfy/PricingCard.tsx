interface Addon {
  id: string;
  code: string;
  name: string;
  description: string;
  price_usd: number;
  is_recurring: boolean;
}

interface PricingCardProps {
  setupUsd: number;
  monthlyUsd: number;
  addons: Addon[];
  selectedAddonCodes: string[];
  onToggleAddon: (code: string) => void;
  totalMonthly: number;
  dueToday: number;
  onCheckout: () => void;
  checkoutLoading: boolean;
}

export default function PricingCard({
  setupUsd,
  monthlyUsd,
  addons,
  selectedAddonCodes,
  onToggleAddon,
  totalMonthly,
  dueToday,
  onCheckout,
  checkoutLoading,
}: PricingCardProps) {
  return (
    <div className="border rounded-2xl bg-white p-5 shadow-sm sticky top-6">
      <div className="text-sm text-gray-500">Pricing</div>
      <div className="mt-2 text-2xl font-semibold">${setupUsd} setup</div>
      <div className="mt-1 text-gray-700">${monthlyUsd}/mo</div>

      {addons.length > 0 && (
        <div className="mt-5">
          <div className="font-medium">Optional add-ons</div>
          <div className="mt-3 space-y-3">
            {addons.map((a) => (
              <label key={a.id} className="flex gap-3 border rounded-2xl p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedAddonCodes.includes(a.code)}
                  onChange={() => onToggleAddon(a.code)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {a.name}{" "}
                    <span className="text-sm text-gray-600">
                      (+${a.price_usd}{a.is_recurring ? "/mo" : ""})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{a.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 border-t pt-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Total monthly</span>
          <span className="font-medium">${totalMonthly}/mo</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Due today</span>
          <span className="font-medium">${dueToday}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={checkoutLoading}
        className="mt-5 w-full rounded-xl bg-black text-white py-3 font-medium disabled:opacity-60 hover:bg-gray-800 transition-colors"
      >
        {checkoutLoading ? "Starting checkout…" : "Start Setup"}
      </button>

      <div className="mt-3 text-xs text-gray-500">
        Setup starts after checkout + intake form.
      </div>
    </div>
  );
}
