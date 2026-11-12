import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1E] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-xs">
              ApexVest Inc. helps everyday investors build long-term wealth
              through smart, diversified investment portfolios.
            </p>
            <div className="flex gap-4 mt-6">
              {["twitter", "linkedin", "instagram"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6366F1] transition-colors"
                >
                  <span className="sr-only">{s}</span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "My Investments", href: "/investments" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Transactions", href: "/transactions" },
                { label: "Withdraw", href: "/withdraw" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-[#6366F1] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "FAQ", href: "/faq" },
                { label: "Help & Support", href: "/help" },
                { label: "Contact Us", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-[#6366F1] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Disclosures",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="hover:text-[#6366F1] transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ApexVest Inc. All rights reserved.</p>
          <p>
            Investments involve risk. Past performance is not indicative of
            future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
