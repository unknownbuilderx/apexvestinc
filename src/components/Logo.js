"use client";
import Link from "next/link";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      {/* Icon mark */}
      <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M3 13L7 8L10 11L14 5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="5" r="1.5" fill="white" />
        </svg>
      </div>
      <div className="leading-tight">
        <span
          className={`font-bold text-base tracking-tight ${
            light ? "text-white" : "text-[#0A1628]"
          }`}
        >
          Grow Vest
        </span>
        <span
          className={`block text-[10px] font-medium tracking-widest uppercase ${
            light ? "text-[#00C853]" : "text-[#00C853]"
          }`}
        >
          Inc.
        </span>
      </div>
    </Link>
  );
}
