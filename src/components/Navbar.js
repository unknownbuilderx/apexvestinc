"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Logo />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-[#00C853] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-[#00C853] transition-colors px-4 py-2"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-[#00C853] text-white px-5 py-2 rounded-lg hover:bg-[#00a844] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-slate-600"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-[#00C853] py-2"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-center border border-slate-200 rounded-lg py-2.5 text-slate-700"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-center bg-[#00C853] text-white rounded-lg py-2.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
