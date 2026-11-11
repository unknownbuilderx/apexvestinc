import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const values = [
  {
    icon: "🔒",
    title: "Trust & Transparency",
    desc: "Every transaction, return, and fee is visible on your dashboard. No hidden charges, ever.",
  },
  {
    icon: "📈",
    title: "Results-Driven",
    desc: "We only succeed when you do. Our entire model is built around delivering consistent, measurable returns.",
  },
  {
    icon: "🌍",
    title: "Built for Everyone",
    desc: "Designed for every American investor — straightforward tools, global standards.",
  },
  {
    icon: "⚡",
    title: "Speed & Simplicity",
    desc: "From signup to first investment in under 5 minutes. No paperwork, no complexity.",
  },
];

const team = [
  { name: "Michael Carter", role: "CEO & Co-Founder", initials: "MC" },
  { name: "Jessica Lane", role: "CTO & Co-Founder", initials: "JL" },
  { name: "James Thornton", role: "Chief Investment Officer", initials: "JT" },
  { name: "Rachel Kim", role: "Head of Product", initials: "RK" },
  { name: "David Osei", role: "VP Engineering", initials: "DO" },
  { name: "Sarah Mitchell", role: "Head of Compliance", initials: "SM" },
];

const milestones = [
  { year: "2019", event: "Grow Vest Inc. founded in New York, NY" },
  { year: "2020", event: "Reached 5,000 active investors and $10M AUM" },
  { year: "2021", event: "Launched mobile app with 50K downloads in 3 months" },
  { year: "2022", event: "Expanded nationwide across 30 US states, $250M AUM" },
  { year: "2023", event: "Series B funding round — $40M raised" },
  { year: "2024", event: "Surpassed 140,000 investors and $2.4B AUM" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 sm:pt-24 pb-14 sm:pb-16 bg-[#0A1628]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
            About Us
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            We&apos;re on a mission to democratize wealth
          </h1>
          <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Grow Vest Inc. was built with one belief: that every American
            deserves access to institutional-quality investments, not just the
            privileged few.
          </p>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="text-3xl font-bold text-[#0A1628] mb-5">
                Started in a New York studio. Now managing billions.
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  In 2019, our founders Michael and Jessica were frustrated.
                  Smart, hardworking Americans were keeping their savings in
                  low-yield accounts while institutional investors grew wealthy
                  through diversified portfolios.
                </p>
                <p>
                  They built Grow Vest Inc. to fix that — a platform that
                  combines the sophistication of institutional investment
                  management with a consumer-grade experience anyone can use.
                </p>
                <p>
                  Today, we manage over $2.4 billion in assets for 140,000+
                  investors across the United States. We&apos;re just getting
                  started.
                </p>
              </div>
              <Link
                href="/signup"
                className="mt-8 inline-block px-8 py-3 bg-[#00C853] text-white font-semibold rounded-xl text-sm hover:bg-[#00a844] transition-colors"
              >
                Join Us Today
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "$2.4B+", label: "Assets Managed" },
                { val: "140K+", label: "Active Investors" },
                { val: "12", label: "Countries" },
                { val: "18.7%", label: "Avg. Annual ROI" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center"
                >
                  <p className="text-3xl font-bold text-[#00C853]">{s.val}</p>
                  <p className="text-slate-500 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
              Our Values
            </p>
            <h2 className="text-3xl font-bold text-[#0A1628]">
              What we stand for
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-[#0A1628] mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
              Milestones
            </p>
            <h2 className="text-3xl font-bold text-[#0A1628]">
              Our journey so far
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#0A1628] flex items-center justify-center z-10">
                    <span className="text-[#00C853] text-xs font-bold">
                      {m.year}
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="text-slate-700 font-medium">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
              Leadership
            </p>
            <h2 className="text-3xl font-bold text-[#0A1628]">
              The team behind Grow Vest
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#0A1628] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[#0A1628]">{t.name}</p>
                  <p className="text-slate-500 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#00C853]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow your wealth with us?
          </h2>
          <p className="text-green-100 mb-8">
            Join 140,000+ investors who trust Grow Vest Inc.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-white text-[#00C853] font-bold rounded-xl hover:bg-green-50 transition-colors text-sm"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
