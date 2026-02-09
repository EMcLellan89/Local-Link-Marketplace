import { Link } from "react-router-dom";

interface Product {
  id: string;
  slug: string;
  name: string;
  short_value_prop: string;
  setup_sla_hours: number;
  pricing_preview: {
    setup_usd: number;
    monthly_usd: number;
  };
}

interface ToolCardGridProps {
  products: Product[];
}

export default function ToolCardGrid({ products }: ToolCardGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        No products found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="border rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="font-semibold text-lg">{p.name}</div>
          <div className="mt-2 text-gray-600">{p.short_value_prop}</div>

          <div className="mt-4 text-sm text-gray-600">
            Live in <span className="font-medium">{p.setup_sla_hours} hours</span>
          </div>

          <div className="mt-2 text-sm">
            <span className="font-medium">${p.pricing_preview.setup_usd}</span> setup{" "}
            + <span className="font-medium">${p.pricing_preview.monthly_usd}</span>/mo
          </div>

          <Link
            to={`/merchant/done-for-you/${p.slug}`}
            className="mt-4 inline-flex items-center justify-center w-full rounded-xl bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
