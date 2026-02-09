interface Category {
  key: string;
  name: string;
  description: string;
}

interface CategoryTilesProps {
  categories: Category[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function CategoryTiles({ categories, activeKey, onSelect }: CategoryTilesProps) {
  return (
    <div className="grid md:grid-cols-5 gap-3">
      <button
        onClick={() => onSelect("all")}
        className={`text-left border rounded-2xl p-4 transition-colors ${
          activeKey === "all" ? "bg-black text-white" : "bg-white hover:bg-gray-50"
        }`}
      >
        <div className="font-semibold">All Tools</div>
        <div className={`mt-1 text-sm ${activeKey === "all" ? "text-gray-200" : "text-gray-600"}`}>
          Browse everything
        </div>
      </button>

      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`text-left border rounded-2xl p-4 transition-colors ${
            activeKey === c.key ? "bg-black text-white" : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="font-semibold">{c.name}</div>
          <div className={`mt-1 text-sm ${activeKey === c.key ? "text-gray-200" : "text-gray-600"}`}>
            {c.description}
          </div>
        </button>
      ))}
    </div>
  );
}
