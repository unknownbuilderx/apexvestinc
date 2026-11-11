"use client";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />
      {/*
        On mobile: top padding accounts for 56px fixed top bar + safe area
        On desktop: left padding accounts for 256px fixed sidebar
      */}
      <main
        className="lg:pl-64 w-full"
        style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top, 0px))" }}
      >
        {/* Override padding-top on large screens where there's no top bar */}
        <style>{`@media (min-width: 1024px) { main { padding-top: 0 !important; } }`}</style>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-5 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
