"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { userAPI, transactionAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// History from 2009 to 2026 — 18 data points showing portfolio growth
const chartBars = [
  12, 18, 25, 32, 40, 48, 55, 62, 68, 72, 76, 80, 84, 86, 88, 90, 93, 100,
];
const months = [
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

const typeIcon = {
  Deposit: "💳",
  Return: "📈",
  Withdrawal: "🏦",
  Investment: "📊",
};
const typeColor = {
  Deposit: "text-[#00C853]",
  Return: "text-[#00C853]",
  Withdrawal: "text-red-500",
  Investment: "text-amber-600",
};

// ─── Crypto Rates Widget ─────────────────────────────────────────────────────
function CryptoRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coins =
      "bitcoin,ethereum,binancecoin,solana,ripple,cardano,dogecoin,polkadot";
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins}&order=market_cap_desc&per_page=8&page=1&sparkline=false`,
    )
      .then((r) => r.json())
      .then((data) => setRates(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">₿</span>
          <h2 className="font-bold text-[#0A1628]">Live Crypto Rates</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3 animate-pulse">
              <div className="h-4 w-12 bg-slate-200 rounded mb-2"></div>
              <div className="h-5 w-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );

  if (!rates.length) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">₿</span>
          <h2 className="font-bold text-[#0A1628]">Live Crypto Rates</h2>
        </div>
        <span className="text-xs text-slate-400">Updated just now</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {rates.map((coin) => {
          const up = coin.price_change_percentage_24h >= 0;
          return (
            <div
              key={coin.id}
              className="bg-slate-50 rounded-xl p-3 hover:bg-[#E8FFF1] transition-colors cursor-default"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs font-semibold text-[#0A1628] uppercase">
                  {coin.symbol}
                </span>
              </div>
              <p className="font-bold text-[#0A1628] text-sm">
                $
                {coin.current_price.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-xs font-medium ${up ? "text-[#00C853]" : "text-red-500"}`}
              >
                {up ? "▲" : "▼"}{" "}
                {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Powered by CoinGecko · Rates for reference only
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dash, setDash] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const refreshDashboard = () => {
      Promise.all([userAPI.getDashboard(), transactionAPI.getAll({ limit: 5 })])
        .then(([d, t]) => {
          if (!active) return;
          setDash(d.dashboard);
          setTxns(t.transactions || []);
          setError("");
        })
        .catch((e) => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshDashboard();
    };

    refreshDashboard();
    const intervalId = window.setInterval(refreshDashboard, 15000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const firstName = user?.firstName || "there";

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">
          <svg
            className="w-8 h-8 animate-spin text-[#00C853] mr-3"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading your dashboard…
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-6 py-5 text-sm">
          <p className="font-semibold mb-1">Could not load dashboard</p>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );

  const portfolioValue = dash?.portfolioValue ?? 0;
  const totalReturns = dash?.totalReturns ?? 0;
  const totalInvested = dash?.totalInvested ?? 0;
  const activePlans = dash?.activePlans ?? 0;
  const investments = dash?.investments ?? [];
  const wallet = dash?.walletBalance ?? 0;
  const portfolioGrowthValue = dash?.portfolioGrowthValue ?? 0;
  const pendingInvestment = dash?.pendingInvestment ?? 0;
  const portfolioGrowth =
    Array.isArray(dash?.portfolioGrowth) && dash.portfolioGrowth.length > 1
      ? dash.portfolioGrowth
      : chartBars;
  const chartYearIndexes = portfolioGrowth
    .map((_, index) => index)
    .filter(
      (index) =>
        index === 0 ||
        index === portfolioGrowth.length - 1 ||
        index % Math.ceil((portfolioGrowth.length - 1) / 5) === 0,
    );
  const monthlyROI =
    totalInvested > 0
      ? ((totalReturns / totalInvested) * 100).toFixed(1)
      : "0.0";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · Here&apos;s your portfolio overview
          </p>
        </div>
        <Link
          href="/investments"
          className="inline-flex items-center gap-2 bg-[#00C853] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#00a844] transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Investment
        </Link>
      </div>

      {/* ── Wallet Balance Card (bank-style) ─────────────────────────────────── */}
      <div className="mb-6">
        <div className="relative bg-gradient-to-br from-[#0A1628] via-[#112240] to-[#0A1628] rounded-3xl p-7 overflow-hidden shadow-xl">
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(#00C853 1px, transparent 1px), linear-gradient(90deg, #00C853 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#00C853]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#00C853]/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Top row — label + BTC icon */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Total Balance
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center">
                    <span className="text-white text-xs font-black">₿</span>
                  </div>
                  <span className="text-slate-300 text-xs font-medium">
                    USD Wallet
                  </span>
                </div>
              </div>
              {/* Card chip decoration */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200/30 to-amber-400/20 border border-amber-200/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
              </div>
            </div>

            {/* Big balance number */}
            <div className="mb-6">
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                $
                {wallet.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`text-sm font-semibold ${parseFloat(monthlyROI) > 0 ? "text-[#00C853]" : "text-slate-400"}`}
                >
                  {parseFloat(monthlyROI) > 0 ? "▲" : ""} {monthlyROI}% ROI
                </span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-slate-400 text-xs">
                  {totalReturns > 0
                    ? `+$${totalReturns.toLocaleString(undefined, { maximumFractionDigits: 2 })} all-time`
                    : "Start investing to earn returns"}
                </span>
              </div>
            </div>

            {/* Bottom row — quick stats inline */}
            <div className="flex flex-wrap gap-4 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#00C853]"
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
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Invested</p>
                  <p className="text-white text-sm font-semibold">
                    ${totalInvested.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#00C853]"
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
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Returns</p>
                  <p className="text-[#00C853] text-sm font-semibold">
                    +$
                    {totalReturns.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#00C853]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Active Plans</p>
                  <p className="text-white text-sm font-semibold">
                    {activePlans}
                  </p>
                </div>
              </div>
              {pendingInvestment > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs">Pending Investment</p>
                    <p className="text-amber-400 text-sm font-semibold">
                      $
                      {pendingInvestment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* ── Portfolio Growth — SVG Area Chart ─────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Dark header */}
          <div className="bg-gradient-to-r from-[#0A1628] to-[#112240] px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-bold text-white text-base">
                  Portfolio Growth
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Since 2009 · Live data
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#00C853] text-xs font-medium">All time</p>
                <p className="text-white text-sm font-bold">+{monthlyROI}%</p>
              </div>
            </div>

            {/* Big number */}
            <p className="text-3xl font-black text-white mt-3">
              $
              {portfolioGrowthValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Portfolio growth value
            </p>
          </div>

          {/* SVG area chart */}
          <div className="px-4 pt-4 pb-2">
            <svg
              viewBox="0 0 440 120"
              className="w-full"
              preserveAspectRatio="none"
              style={{ height: "120px" }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C853" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00C853" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00C853" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 30, 60, 90].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="440"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              ))}

              {/* Area path */}
              <path
                d={(() => {
                  const pts = portfolioGrowth.map((h, i) => {
                    const x = (i / (portfolioGrowth.length - 1)) * 440;
                    const y = 110 - (h / 100) * 100;
                    return `${x},${y}`;
                  });
                  return `M ${pts.join(" L ")} L 440,110 L 0,110 Z`;
                })()}
                fill="url(#areaGrad)"
              />

              {/* Line path */}
              <polyline
                points={portfolioGrowth
                  .map((h, i) => {
                    const x = (i / (portfolioGrowth.length - 1)) * 440;
                    const y = 110 - (h / 100) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* End dot (latest value) */}
              {(() => {
                const last = portfolioGrowth.length - 1;
                const x = 440;
                const y = 110 - (portfolioGrowth[last] / 100) * 100;
                return (
                  <>
                    <circle cx={x} cy={y} r="5" fill="#00C853" />
                    <circle cx={x} cy={y} r="9" fill="#00C853" opacity="0.2" />
                  </>
                );
              })()}
            </svg>

            {/* Year labels */}
            <div className="flex justify-between mt-1 mb-3 px-0.5">
              {chartYearIndexes.map((index) => (
                <span key={index} className="text-[9px] text-slate-400">
                  {months[
                    Math.round((index / (portfolioGrowth.length - 1)) * 17)
                  ]}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom stats row */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
            {[
              {
                label: "Total Invested",
                val: `$${totalInvested.toLocaleString()}`,
                color: "text-[#0A1628]",
              },
              {
                label: "Balance",
                val: `$${wallet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                color: "text-[#00C853]",
              },
              {
                label: "Net Gain",
                val: `+$${totalReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                color: "text-[#00C853]",
              },
            ].map((s) => (
              <div key={s.label} className="px-4 py-3 text-center">
                <p className="text-xs text-slate-400 mb-0.5">{s.label}</p>
                <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-[#0A1628] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: "Deposit", href: "/investments", icon: "💳" },
              { label: "Withdraw", href: "/withdraw", icon: "🏦" },
              { label: "Portfolio", href: "/portfolio", icon: "📊" },
              { label: "History", href: "/transactions", icon: "📋" },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-[#E8FFF1] hover:text-[#00C853] transition-colors text-slate-600 text-xs font-medium"
              >
                <span>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>

          {/* Wallet balance card */}
          <div className="bg-[#0A1628] rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold text-white">
              $
              {wallet.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <Link
              href="/investments"
              className="mt-3 inline-block bg-[#00C853] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#00a844] transition-colors"
            >
              Invest Now
            </Link>
          </div>
        </div>
      </div>

      {/* Crypto Rates Widget */}
      <CryptoRates />

      {/* Active plans */}
      {investments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628]">
              Active Investment Plans
            </h2>
            <Link
              href="/investments"
              className="text-xs text-[#00C853] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {investments.map((plan) => (
              <div
                key={plan._id}
                className="p-4 rounded-xl bg-slate-50 hover:bg-[#E8FFF1]/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#00C853]"
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
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1628] text-sm">
                        {plan.planName} Plan
                      </p>
                      <p className="text-slate-400 text-xs">
                        Matures{" "}
                        {new Date(plan.maturityDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Invested</p>
                      <p className="font-semibold text-[#0A1628]">
                        ${plan.amountInvested?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Returns</p>
                      <p className="font-semibold text-[#00C853]">
                        +${plan.returnsEarned?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Daily</p>
                      <p className="font-semibold text-[#0A1628]">
                        +${plan.dailyReturn?.toFixed(2)}
                      </p>
                    </div>
                    <span className="bg-[#E8FFF1] text-[#00C853] text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{plan.progressPct || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00C853] rounded-full transition-all"
                      style={{ width: `${plan.progressPct || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state when no investments */}
      {investments.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 mb-6 text-center">
          <p className="text-4xl mb-3">📈</p>
          <h3 className="font-bold text-[#0A1628] text-lg mb-2">
            No active investments yet
          </h3>
          <p className="text-slate-500 text-sm mb-5">
            Start your first investment plan and watch your money grow every
            day.
          </p>
          <Link
            href="/investments"
            className="inline-block bg-[#00C853] text-white font-semibold px-8 py-3 rounded-xl text-sm hover:bg-[#00a844] transition-colors"
          >
            Browse Plans
          </Link>
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#0A1628]">Recent Transactions</h2>
          <Link
            href="/transactions"
            className="text-xs text-[#00C853] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        {txns.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">
            No transactions yet
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {txns.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-sm">
                    {typeIcon[t.type] || "💰"}
                  </div>
                  <div>
                    <p className="font-medium text-[#0A1628] text-sm">
                      {t.type}
                    </p>
                    <p className="text-slate-400 text-xs">{t.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${typeColor[t.type] || "text-[#0A1628]"}`}
                  >
                    {t.type === "Withdrawal" || t.type === "Investment"
                      ? "-"
                      : "+"}
                    $
                    {t.amount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
