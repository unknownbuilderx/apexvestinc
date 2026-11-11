import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(#00C853 1px, transparent 1px), linear-gradient(90deg, #00C853 1px, transparent 1px)",
        backgroundSize: "50px 50px"
      }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00C853]/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="flex justify-center mb-10">
          <Logo light />
        </div>

        {/* 404 display */}
        <div className="mb-6">
          <p className="text-[120px] sm:text-[160px] font-black text-white/10 leading-none select-none">404</p>
          <div className="-mt-8 sm:-mt-12">
            <div className="w-16 h-16 rounded-2xl bg-[#00C853]/20 border border-[#00C853]/30 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page not found
        </h1>
        <p className="text-slate-400 leading-relaxed mb-8 text-sm sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3.5 bg-[#00C853] text-white font-semibold rounded-xl hover:bg-[#00a844] transition-colors text-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-sm"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { label: "Investments", href: "/investments" },
            { label: "Portfolio", href: "/portfolio" },
            { label: "Help", href: "/help" },
            { label: "Contact", href: "/contact" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
