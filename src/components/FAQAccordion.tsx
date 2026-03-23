"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-zinc-600 text-sm py-8 text-center border-t border-white/8">
        아직 FAQ가 없습니다.
      </p>
    );
  }

  return (
    <div className="faq-list divide-y divide-white/8 border-t border-white/8">
      {items.map((faq) => (
        <div key={faq.id}>
          <button
            onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between py-5 text-left gap-4 group"
          >
            <span className="faq-question text-zinc-100 font-medium group-hover:text-primary-400 transition-colors">
              {faq.question}
            </span>
            <span className="flex-shrink-0 text-zinc-500 group-hover:text-primary-400 transition-colors">
              {open === faq.id ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          {open === faq.id && (
            <div className="pb-5 text-zinc-400 text-sm leading-relaxed pr-8">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
