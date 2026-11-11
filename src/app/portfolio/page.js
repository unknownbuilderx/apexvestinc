"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { userAPI, investmentAPI } from "@/lib/api";

// Historical portfolio data from 2009 to present
const monthlyData = [
  { month: "Jan 2009", value: 5000, returns: 0 },
  { month: "Jul 2009", value: 6200, returns: 1200 },
  { month: "Jan 2010", value: 7800, returns: 2800 },
  { month: "Jul 2010", value: 9500, returns: 4500 },
  { month: "Jan 2011", value: 11200, returns: 6200 },
  { month: "Jul 2011", value: 13500, returns: 8500 },
  { month: "Jan 2012", value: 16800, returns: 11800 },
  { month: "Jul 2012", value: 19500, returns: 14500 },
  { month: "Jan 2013", value: 23000, returns: 18000 },
  { month: "Jul 2013", value: 27500, returns: 22500 },
  { month: "Jan 2014", value: 32000, returns: 27000 },
  { month: "Jul 2014", value: 38500, returns: 33500 },
  { month: "Jan 2015", value: 45000, returns: 40000 },
  { month: "Jul 2015", value: 52000, returns: 47000 },
  { month: "Jan 2016", value: 58000, returns: 53000 },
  { month: "Jul 2016", value: 65000, returns: 60000 },
  { month: "Jan 2017", value: 72000, returns: 67000 },
  { month: "Jul 2017", value: 81000, returns: 76000 },
  { month: "Jan 2018", value: 92000, returns: 87000 },
  { month: "Jul 2018", value: 105000, returns: 100000 },
  { month: "Jan 2019", value: 118000, returns: 113000 },
  { month: "Jul 2019", value: 132000, returns: 127000 },
  { month: "Jan 2020", value: 145000, returns: 140000 },
  { month: "Jul 2020", value: 162000, returns: 157000 },
  { month: "Jan 2021", value: 185000, returns: 180000 },
  { month: "Jul 2021", value: 210000, returns: 205000 },
  { month: "Jan 2022", value: 235000, returns: 230000 },
  { month: "Jul 2022", value: 260000, returns: 255000 },
  { month: "Jan 2023", value: 285000, returns: 280000 },
  { month: "Jul 2023", value: 310000, returns: 305000 },
  { month: "Jan 2024", value: 340000, returns: 335000 },
  { month: "Jul 2024", value: 370000, returns: 365000 },
  { month: "Jan 2025", value: 395000, returns: 390000 },
  { month: "Jul 2025", value: 420000, returns: 415000 },
  { month: "Jan 2026", value: 445000, returns: 440000 },
  { month: "Jul 2026", value: 48250, returns: 9620 },
];

const maxVal = Math.max(...monthlyData.map((d) => d.value));
const minVal = Math.min(...monthlyData.map((d) => d.value));

export default function PortfolioPage() {
  const [period, setPeriod] = useState("All");
  const [dash, setDash] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userAPI.getDashboard(), investmentAPI.getAll()])
      .then(([d, i]) => {
        setDash(d.dashboard);
        setInvestments(i.investments || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const portfolioValue = dash?.portfolioValue ?? 0;
  const totalReturns = dash?.totalReturns ?? 0;
  const totalInvested = dash?.totalInvested ?? 0;
  const wallet = dash?.walletBalance ?? 0;
  const activePlans = dash?.activePlans ?? 0;
  const annualROI =
    totalInvested > 0
      ? ((totalReturns / totalInvested) * 100).toFixed(1)
      : "0.0";

  const metrics = [
    {
      label: "Portfolio Value",
      val: `$${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      sub: `Balance: $${wallet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      up: true,
    },
    {
      label: "Total Invested",
      val: `$${totalInvested.toLocaleString()}`,
      sub: `${activePlans} active plan${activePlans !== 1 ? "s" : ""}`,
      up: null,
    },
    {
      label: "Net Returns",
      val: `+$${totalReturns.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      sub: `${annualROI}% annual ROI`,
      up: true,
    },
    { label: "Best Month", val: "+$18,500", sub: "Jul 2021", up: true },
    { label: "Worst Month", val: "+$1,200", sub: "Jul 2009", up: null },
    { label: "Since", val: "Jan 2009", sub: "17 years active", up: true },
  ];

  // Chart points
  const points = monthlyData.map((d, i) => {
    const x = (i / (monthlyData.length - 1)) * 700;
    const y = 160 - ((d.value - minVal) / (maxVal - minVal || 1)) * 140 - 10;
    return { x, y, ...d };
  });
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L 700,160 L 0,160 Z`;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">
            Portfolio Performance
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track your investment growth since 2009
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
          Add Investment
        </Link>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
          >
            <p className="text-xs text-slate-400 mb-1">{m.label}</p>
            <p className="text-base font-bold text-[#0A1628] leading-tight">
              {m.val}
            </p>
            <p
              className={`text-xs mt-1 font-medium ${m.up === true ? "text-[#00C853]" : "text-slate-400"}`}
            >
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-[#0A1628]">
              Portfolio Growth Since 2009
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              <span className="text-[#0A1628] font-semibold">
                ${portfolioValue.toLocaleString()}
              </span>
              {" · "}
              <span className="text-[#00C853] font-semibold">
                +{annualROI}% ROI
              </span>
              {" · since Jan 2009"}
            </p>
          </div>
          <div className="flex gap-2">
            {["1Y", "5Y", "10Y", "All"].map((t) => (
              <button
                key={t}
                onClick={() => setPeriod(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${period === t ? "bg-[#0A1628] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* SVG chart */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400 pr-2 w-14">
            {["$500K", "$375K", "$250K", "$125K", "$5K"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div className="ml-14">
            <svg
              viewBox="0 0 700 160"
              className="w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C853" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="700"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              ))}
              <path d={areaPath} fill="url(#chartGrad)" />
              <polyline
                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#00C853"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points
                .filter((_, i) => i % 4 === 0 || i === points.length - 1)
                .map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={i === points.length - 1 ? 5 : 3}
                    fill={i === points.length - 1 ? "#00C853" : "white"}
                    stroke="#00C853"
                    strokeWidth="2"
                  />
                ))}
            </svg>
            <div className="flex justify-between mt-2 overflow-x-auto">
              {points
                .filter((_, i) => i % 6 === 0)
                .map((p) => (
                  <span
                    key={p.month}
                    className="text-[10px] text-slate-400 whitespace-nowrap"
                  >
                    {p.month}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active investments */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#0A1628]">
            Active Investments ({investments.length})
          </h2>
          <Link
            href="/investments"
            className="text-xs text-[#00C853] hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="py-10 text-center text-slate-400">
            <svg
              className="w-6 h-6 animate-spin text-[#00C853] mx-auto mb-2"
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
            Loading investments…
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">📈</p>
            <p className="font-medium text-[#0A1628]">No active investments</p>
            <Link
              href="/investments"
              className="mt-3 inline-block bg-[#00C853] text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#00a844] transition-colors"
            >
              Start Investing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((inv) => (
              <div
                key={inv._id}
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
                        {inv.planName} Plan
                      </p>
                      <p className="text-slate-400 text-xs">
                        Matures{" "}
                        {inv.maturityDate
                          ? new Date(inv.maturityDate).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Invested</p>
                      <p className="font-semibold text-[#0A1628]">
                        ${(inv.amountInvested || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Returns</p>
                      <p className="font-semibold text-[#00C853]">
                        +${(inv.returnsEarned || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">ROI</p>
                      <p className="font-semibold text-[#00C853]">
                        {inv.roiRate || 0}%
                      </p>
                    </div>
                    <span className="bg-[#E8FFF1] text-[#00C853] text-xs font-semibold px-3 py-1 rounded-full">
                      {inv.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{inv.progressPct || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00C853] rounded-full"
                      style={{ width: `${inv.progressPct || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly returns bar chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-[#0A1628] mb-5">
          Monthly Returns Breakdown
        </h2>
        <div className="flex items-end gap-1 h-28 overflow-x-auto">
          {monthlyData.slice(-24).map((d, i) => {
            const maxReturn = Math.max(
              ...monthlyData.slice(-24).map((r) => r.returns),
            );
            const h = maxReturn > 0 ? (d.returns / maxReturn) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 min-w-[8px] flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-full bg-[#00C853]/20 group-hover:bg-[#00C853]/40 rounded-t transition-all"
                  style={{ height: `${Math.max(h, 1)}px`, minHeight: "2px" }}
                />
                <span className="text-[8px] text-slate-400 whitespace-nowrap hidden lg:block">
                  {d.month.split(" ")[1] || d.month}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 text-sm">
          <span className="text-slate-400 text-xs">
            Avg monthly:{" "}
            <span className="font-semibold text-[#0A1628]">
              $
              {(
                monthlyData.reduce((s, d) => s + d.returns, 0) /
                monthlyData.length
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </span>
          <span className="text-[#00C853] font-semibold text-xs">
            Total: +$
            {totalReturns.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            since 2009
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
