import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const stats = [
  { value: "$2.4B+", label: "Assets Under Management" },
  { value: "140K+", label: "Active Investors" },
  { value: "18.7%", label: "Avg. Annual Return" },
  { value: "99.9%", label: "Uptime Reliability" },
];

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
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
    title: "Smart Portfolio Builder",
    desc: "Our AI-powered engine automatically diversifies your investments across high-growth assets tailored to your risk appetite.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Bank-Grade Security",
    desc: "256-bit SSL encryption, two-factor authentication, and biometric login keep your funds and data always protected.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
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
    title: "Instant Withdrawals",
    desc: "Access your earnings any time. Our streamlined withdrawal system processes funds in under 24 hours.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Real-Time Analytics",
    desc: "Track your portfolio growth with live charts, performance metrics, and detailed transaction history.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Expert Investment Plans",
    desc: "Choose from Starter, Growth, and Premium plans curated by our team of certified financial advisors.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "24/7 Support",
    desc: "Our dedicated support team is available around the clock to help you with any investment questions.",
  },
];

const plans = [
  {
    name: "Starter",
    min: "$500",
    roi: "8% – 12%",
    duration: "3 months",
    perks: [
      "Daily returns",
      "Instant withdrawal",
      "Email support",
      "Basic analytics",
    ],
    popular: false,
    color: "bg-white",
  },
  {
    name: "Growth",
    min: "$2,500",
    roi: "14% – 20%",
    duration: "6 months",
    perks: [
      "Daily returns",
      "Priority withdrawal",
      "24/7 support",
      "Advanced analytics",
      "Portfolio rebalancing",
    ],
    popular: true,
    color: "bg-[#0A0F1E]",
  },
  {
    name: "Premium",
    min: "$10,000",
    roi: "22% – 35%",
    duration: "12 months",
    perks: [
      "Daily returns",
      "Instant withdrawal",
      "Dedicated advisor",
      "Full analytics suite",
      "Compounding returns",
      "VIP events access",
    ],
    popular: false,
    color: "bg-white",
  },
];

const testimonials = [
  {
    name: "Ashley Monroe",
    role: "Entrepreneur, New York",
    avatar: "AM",
    text: "ApexVest has completely changed how I manage my money. My portfolio grew 23% in just 8 months. The platform is clean, fast, and trustworthy.",
    rating: 5,
  },
  {
    name: "Derek Sullivan",
    role: "Software Engineer, Austin",
    avatar: "DS",
    text: "I was skeptical at first, but the transparency on the dashboard won me over. I can track every dollar in real time. Highly recommended.",
    rating: 5,
  },
  {
    name: "Lauren Hayes",
    role: "Medical Doctor, Chicago",
    avatar: "LH",
    text: "The Growth plan gave me better returns than my savings account. Withdrawals are fast and the support team responds within minutes.",
    rating: 5,
  },
];

const trustPills = [
  "SEC Registered",
  "256-bit Encryption",
  "FINRA Member",
  "24h Withdrawals",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 bg-[#0A0F1E] overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.18]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #6366F1 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
        </div>
        {/* Gradient mesh glows */}
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-[#6366F1]/25 rounded-full blur-3xl" />
        <div className="absolute top-10 right-0 w-96 h-96 bg-[#8B5CF6]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D946EF]/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-violet-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
              Trusted by 140,000+ investors across the US
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Take your wealth to the{" "}
              <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
                apex
              </span>
              .
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              ApexVest Inc. is the premium investment platform that puts your
              money to work. Earn consistent returns, track your portfolio in
              real time, and withdraw anytime.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#6366F1]/30 text-sm"
              >
                Start Investing Today
              </Link>
              <Link
                href="/how-it-works"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/15 text-sm backdrop-blur"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {trustPills.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#8B5CF6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Glassmorphism dashboard mockup */}
          <div className="mt-16 max-w-4xl mx-auto relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-3xl blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span className="ml-2 text-xs text-slate-400">
                  app.apexvestinc.com
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Portfolio Value", val: "$48,250.00", up: true },
                  { label: "Total Returns", val: "+$9,620.40", up: true },
                  { label: "Active Plans", val: "3 Plans", up: null },
                  { label: "Monthly ROI", val: "18.7%", up: true },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/5 rounded-xl p-3 border border-white/5"
                  >
                    <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                    <p
                      className={`text-sm font-bold ${s.up ? "text-[#8B5CF6]" : "text-white"}`}
                    >
                      {s.val}
                    </p>
                  </div>
                ))}
              </div>
              {/* Area chart */}
              <div className="relative">
                <svg
                  viewBox="0 0 600 160"
                  className="w-full h-32"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#8B5CF6"
                        stopOpacity="0.45"
                      />
                      <stop
                        offset="100%"
                        stopColor="#6366F1"
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#D946EF" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,140 C80,130 120,110 180,100 C240,90 280,95 340,70 C400,45 460,55 520,30 C560,20 580,25 600,15 L600,160 L0,160 Z"
                    fill="url(#areaGrad)"
                  />
                  <path
                    d="M0,140 C80,130 120,110 180,100 C240,90 280,95 340,70 C400,45 460,55 520,30 C560,20 580,25 600,15"
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="600" cy="15" r="4" fill="#D946EF" />
                </svg>
              </div>
            </div>

            {/* Floating ROI chip */}
            <div className="hidden sm:flex absolute -right-5 -bottom-5 items-center gap-3 bg-[#0A0F1E]/90 backdrop-blur border border-white/10 rounded-xl px-4 py-3 shadow-xl">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-bold">+23% YTD</p>
                <p className="text-slate-400 text-[10px]">Portfolio growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label} className="relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
                <p className="mt-4 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-slate-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#6366F1] text-sm font-semibold uppercase tracking-widest mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0F1E]">
              Everything you need to grow your wealth
            </h2>
            <p className="mt-4 text-slate-500">
              Built for serious investors who want transparency, security, and
              consistent returns.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-[#6366F1]/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-[#6366F1] group-hover:to-[#8B5CF6] group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[#0A0F1E] mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#6366F1] text-sm font-semibold uppercase tracking-widest mb-3">
              Investment Plans
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0F1E]">
              Choose your growth path
            </h2>
            <p className="mt-4 text-slate-500">
              Flexible plans designed to match your financial goals and risk
              tolerance.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-8 ${p.color} ${
                  p.popular
                    ? "ring-2 ring-[#6366F1] shadow-2xl scale-105"
                    : "border border-slate-200 shadow-sm"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[#6366F1]">
                  {p.name}
                </p>
                <p
                  className={`text-3xl font-bold ${p.popular ? "text-white" : "text-[#0A0F1E]"}`}
                >
                  {p.min}{" "}
                  <span className="text-sm font-normal opacity-60">min.</span>
                </p>
                <div
                  className={`mt-3 mb-6 text-sm ${p.popular ? "text-slate-300" : "text-slate-500"}`}
                >
                  <span className="font-semibold text-[#6366F1]">{p.roi}</span>{" "}
                  ROI · {p.duration}
                </div>
                <ul className="space-y-3 mb-8">
                  {p.perks.map((perk) => (
                    <li
                      key={perk}
                      className={`flex items-center gap-2 text-sm ${p.popular ? "text-slate-300" : "text-slate-600"}`}
                    >
                      <svg
                        className="w-4 h-4 text-[#8B5CF6] flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    p.popular
                      ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-90"
                      : "bg-[#0A0F1E] text-white hover:bg-[#141B2E]"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#6366F1] text-sm font-semibold uppercase tracking-widest mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A0F1E]">
              Investors love ApexVest
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A0F1E] text-white text-xs font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0A0F1E]">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 bg-[#0A0F1E] overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-64 bg-[#6366F1]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#D946EF]/15 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start building your wealth?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join 140,000+ investors already growing with ApexVest Inc.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#6366F1]/30 text-sm"
          >
            Create Your Free Account
          </Link>
          <p className="mt-4 text-slate-500 text-xs">
            No hidden fees · Cancel anytime · Secure &amp; regulated
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
