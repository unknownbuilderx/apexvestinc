import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in under 2 minutes. Provide your basic info, verify your email, and you're in. No paperwork, no branch visits.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Choose Your Plan",
    desc: "Pick from Starter ($500+), Growth ($2,500+), or Premium ($10,000+) based on your goals and how much you want to grow.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Fund Your Account",
    desc: "Transfer funds securely via bank transfer, card payment, or crypto. Funds are confirmed and activated within minutes.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Watch Your Money Grow",
    desc: "Returns accrue daily. Monitor your live portfolio from your dashboard — charts, ROI breakdowns, and performance analytics.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Withdraw Anytime",
    desc: "Ready to cash out? Request a withdrawal from your dashboard. Funds hit your bank account within 24 hours — always.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "Is my money safe?",
    a: "Yes. We use 256-bit encryption, segregated accounts, and are registered with all relevant financial regulators.",
  },
  {
    q: "What is the minimum investment?",
    a: "You can start with as little as $500 on our Starter plan.",
  },
  {
    q: "How are returns calculated?",
    a: "Returns accrue daily based on your active plan's ROI rate and are added to your balance each day.",
  },
  {
    q: "Can I have multiple investment plans?",
    a: "Absolutely. Many of our investors run 2–3 plans simultaneously for diversification.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 sm:pt-24 pb-14 sm:pb-16 bg-[#0A0F1E]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#6366F1] text-sm font-semibold uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Simple. Transparent. Profitable.
          </h1>
          <p className="mt-5 text-slate-300 text-lg">
            From signup to your first return in under 10 minutes.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Visual */}
                <div className="flex-shrink-0 w-full md:w-80">
                  <div className="bg-[#0A0F1E] rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-xl bg-[#6366F1]/20 text-[#8B5CF6] flex items-center justify-center mx-auto mb-4">
                      {s.icon}
                    </div>
                    <span className="text-6xl font-black text-white/10">
                      {s.num}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1">
                  <div className="inline-block bg-[#EEF2FF] text-[#6366F1] text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Step {s.num}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A0F1E] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans comparison table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A0F1E]">
              Plan Comparison
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#0A0F1E] text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Starter
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-[#8B5CF6]">
                    Growth
                  </th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Minimum Investment", "$500", "$2,500", "$10,000"],
                  ["ROI Range", "8–12%", "14–20%", "22–35%"],
                  ["Duration", "3 months", "6 months", "12 months"],
                  ["Daily Returns", "✓", "✓", "✓"],
                  ["Withdrawal Speed", "24hrs", "Priority", "Instant"],
                  ["Dedicated Advisor", "✗", "✗", "✓"],
                  ["Compounding", "✗", "Optional", "✓"],
                ].map(([feat, s, g, p]) => (
                  <tr key={feat} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {feat}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                      {s}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-[#6366F1]">
                      {g}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                      {p}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A0F1E]">Quick answers</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-slate-200 rounded-xl p-5">
                <p className="font-semibold text-[#0A0F1E] mb-2">{f.q}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to start? It only takes 2 minutes.
          </h2>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-[#6366F1] font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors"
          >
            Open Your Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
