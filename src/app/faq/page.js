"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  {
    cat: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Visit our signup page, fill in your name, email, and a secure password. Verify your email and you're ready to invest in under 2 minutes.",
      },
      {
        q: "Is there an age requirement?",
        a: "You must be at least 18 years old to open an investment account with Grow Vest Inc.",
      },
      {
        q: "What countries do you support?",
        a: "We currently serve investors across the United States. International availability is coming soon.",
      },
      {
        q: "Do I need prior investment experience?",
        a: "Not at all. Our platform is designed for everyone from complete beginners to seasoned investors.",
      },
    ],
  },
  {
    cat: "Investments & Returns",
    items: [
      {
        q: "What is the minimum investment?",
        a: "You can start with as little as $500 on our Starter plan. The Growth plan starts at $2,500 and Premium at $10,000.",
      },
      {
        q: "How are returns calculated?",
        a: "Returns are calculated daily based on your active plan's annual ROI rate, prorated to a daily percentage and credited to your balance each day.",
      },
      {
        q: "Can I invest in multiple plans simultaneously?",
        a: "Yes! Many of our investors run 2–3 plans at once for maximum diversification and returns.",
      },
      {
        q: "What happens when my plan matures?",
        a: "When your investment plan matures, your principal and returns are added to your wallet. You can reinvest or withdraw at any time.",
      },
    ],
  },
  {
    cat: "Deposits & Withdrawals",
    items: [
      {
        q: "How do I fund my account?",
        a: "You can fund via bank transfer, debit/credit card, or cryptocurrency. Deposits are confirmed within 1–30 minutes depending on the method.",
      },
      {
        q: "How long do withdrawals take?",
        a: "Standard withdrawals process within 24 hours. Premium plan holders enjoy instant withdrawals to their bank accounts.",
      },
      {
        q: "Is there a withdrawal fee?",
        a: "There are no withdrawal fees. You receive 100% of the amount you request.",
      },
      {
        q: "What is the minimum withdrawal amount?",
        a: "The minimum withdrawal amount is $50.",
      },
    ],
  },
  {
    cat: "Security & Trust",
    items: [
      {
        q: "Is Grow Vest Inc. regulated?",
        a: "Yes. We are registered with the SEC and FINRA, and fully compliant with all applicable US financial regulations.",
      },
      {
        q: "How is my money protected?",
        a: "Your funds are held in segregated escrow accounts, separate from company operating funds. We also maintain investor protection insurance.",
      },
      {
        q: "What security features do you have?",
        a: "We use 256-bit SSL encryption, two-factor authentication, biometric login, and real-time fraud monitoring on all accounts.",
      },
      {
        q: "What happens if Grow Vest shuts down?",
        a: "Client funds are always segregated and protected. In the unlikely event of insolvency, all investor funds are returned in full before any other obligations.",
      },
    ],
  },
];

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-[#0A1628] text-sm">{q}</span>
        <svg
          className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Getting Started");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 sm:pt-24 pb-14 sm:pb-16 bg-[#0A1628]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 text-slate-300">
            Find quick answers to the most common questions about Grow Vest Inc.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((c) => (
              <button
                key={c.cat}
                onClick={() => setActiveCategory(c.cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === c.cat
                    ? "bg-[#0A1628] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c.cat}
              </button>
            ))}
          </div>

          {/* Questions */}
          {categories
            .filter((c) => c.cat === activeCategory)
            .map((c) => (
              <div key={c.cat} className="space-y-3">
                {c.items.map((item) => (
                  <AccordionItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#0A1628] mb-3">
            Still have questions?
          </h2>
          <p className="text-slate-500 mb-6">
            Our support team is available 24/7 to help you with anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-[#00C853] text-white font-semibold rounded-xl text-sm hover:bg-[#00a844] transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:border-slate-300 transition-colors"
            >
              Help Center
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
