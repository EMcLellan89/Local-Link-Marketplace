import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQ[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  if (items.length === 0) {
    return <div className="text-gray-600">No FAQs available.</div>;
  }

  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div key={idx} className="border rounded-2xl p-4">
          <button
            className="w-full text-left font-medium flex justify-between items-center"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span>{it.q}</span>
            <span className="text-gray-500 text-xl">{open === idx ? "−" : "+"}</span>
          </button>
          {open === idx && <div className="mt-2 text-gray-600">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}
