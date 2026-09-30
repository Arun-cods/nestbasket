import React from 'react';
import { Search, Split, ShoppingBag, ShieldCheck, CheckCircle2, TrendingDown } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-emerald-600" />,
      step: '01',
      title: 'Search or Add Any Item',
      desc: 'Type your daily shopping list: Milk, Atta, Tomatoes, Dal, Snacks, or Detergents across 24,500+ indexed items.',
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-amber-500" />,
      step: '02',
      title: 'Unmask Hidden Platform Fees',
      desc: 'See exact prices side-by-side across Blinkit, Zepto, Swiggy Instamart, and BB Now with surge & handling fees exposed.',
    },
    {
      icon: <Split className="w-6 h-6 text-sky-600" />,
      step: '03',
      title: 'Split & Save ₹150–₹300',
      desc: 'Our Smart Basket optimizer calculates whether single store or splitting orders across 2 apps saves you the most money.',
    },
  ];

  return (
    <section className="mb-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
          The NestBasket Formula
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
          How Indian Households Save ₹3,000+ Every Month
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Zero markup. Direct darkstore price comparisons in under 5 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((st) => (
          <div
            key={st.step}
            className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  {st.icon}
                </div>
                <span className="text-2xl font-black text-slate-300">{st.step}</span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">{st.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Daily</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
