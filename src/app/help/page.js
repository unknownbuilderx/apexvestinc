import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const helpCategories = [
  {
    icon: "🚀",
    title: "Getting Started",
    desc: "New to ApexVest? Learn how to create your account and make your first investment.",
    articles: [
      "How to create an account",
      "Verifying your identity (KYC)",
      "Funding your wallet for the first time",
      "Choosing the right investment plan",
    ],
    href: "/faq",
  },
  {
    icon: "💰",
    title: "Deposits & Funding",
    desc: "Everything about adding money to your ApexVest account.",
    articles: [
      "Supported payment methods",
      "How long deposits take",
      "Minimum deposit amounts",
      "Troubleshooting failed deposits",
    ],
    href: "/faq",
  },
  {
    icon: "📊",
    title: "Investments & Returns",
    desc: "Understand how returns work and how to track your portfolio.",
    articles: [
      "How daily returns are calculated",
      "When returns are credited",
      "Understanding the plans",
      "Reinvesting your returns",
    ],
    href: "/faq",
  },
  {
    icon: "🏦",
    title: "Withdrawals",
    desc: "How to withdraw your funds quickly and safely.",
    articles: [
      "How to request a withdrawal",
      "Withdrawal processing times",
      "Minimum withdrawal amount",
      "Bank account linking guide",
    ],
    href: "/faq",
  },
  {
    icon: "🔒",
    title: "Account & Security",
    desc: "Keep your account safe and manage your settings.",
    articles: [
      "Enabling two-factor authentication",
      "Changing your password",
      "What to do if you're hacked",
      "Biometric login setup",
    ],
    href: "/security",
  },
  {
    icon: "🤝",
    title: "Referrals & Bonuses",
    desc: "Earn extra by referring friends to ApexVest.",
    articles: [
      "How the referral program works",
      "Claiming your referral bonus",
      "Referral payout schedule",
      "Terms and conditions",
    ],
    href: "/faq",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 sm:pt-24 pb-14 sm:pb-16 bg-[#0A0F1E]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#6366F1] text-sm font-semibold uppercase tracking-widest mb-3">
            Help Center
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            How can we help you?
          </h1>
          <p className="mt-4 text-slate-300">
            Search our help articles or browse by category below.
          </p>
          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-[#0A0F1E] text-lg mb-1">
                  {cat.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  {cat.desc}
                </p>
                <ul className="space-y-2 mb-5">
                  {cat.articles.map((a) => (
                    <li key={a}>
                      <Link
                        href={cat.href}
                        className="text-sm text-[#6366F1] hover:underline flex items-center gap-1"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {a}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#0A0F1E] mb-3">
            Can&apos;t find what you need?
          </h2>
          <p className="text-slate-500 mb-8">
            Our support team is available 24/7 via email, phone, or live chat.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: "💬", label: "Live Chat", sub: "Available now" },
              {
                icon: "📧",
                label: "Email Support",
                sub: "support@apexvestinc.com",
              },
              { icon: "📞", label: "Phone Support", sub: "+1 (800) APX-VEST" },
            ].map((c) => (
              <Link
                href="/contact"
                key={c.label}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-[#6366F1] hover:shadow-sm transition-all"
              >
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-semibold text-[#0A0F1E] text-sm">
                  {c.label}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{c.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
