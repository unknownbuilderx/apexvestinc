import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

const planData = {
  "growth-1": {
    name: "Growth Plan",
    tier: "Growth",
    invested: 25000,
    returns: 4820,
    totalValue: 29820,
    roi: "19.3%",
    dailyReturn: 48.5,
    annualRate: "14–20%",
    duration: "6 months",
    startDate: "Jun 15, 2026",
    maturity: "Dec 15, 2026",
    progress: 68,
    status: "Active",
    description:
      "The Growth Plan provides balanced exposure to high-performing equities, government bonds, and real estate investment trusts (REITs). Managed by our certified portfolio team, it targets consistent mid-range returns with controlled risk.",
    allocation: [
      {
        asset: "Equities (US & Global Markets)",
        pct: 40,
        color: "bg-[#00C853]",
      },
      { asset: "Fixed Income / Bonds", pct: 30, color: "bg-[#0A1628]" },
      { asset: "REITs", pct: 20, color: "bg-blue-400" },
      { asset: "Cash & Equivalents", pct: 10, color: "bg-slate-300" },
    ],
    dailyHistory: [
      { date: "Oct 2", amount: 48.5 },
      { date: "Oct 1", amount: 48.5 },
      { date: "Sep 30", amount: 48.5 },
      { date: "Sep 29", amount: 48.5 },
      { date: "Sep 28", amount: 48.5 },
      { date: "Sep 27", amount: 48.5 },
    ],
    risk: "Medium",
    manager: "James Thornton, CFA",
  },
  "premium-1": {
    name: "Premium Plan",
    tier: "Premium",
    invested: 15000,
    returns: 3600,
    totalValue: 18600,
    roi: "24.0%",
    dailyReturn: 32.2,
    annualRate: "22–35%",
    duration: "12 months",
    startDate: "Mar 3, 2026",
    maturity: "Mar 3, 2027",
    progress: 42,
    status: "Active",
    description:
      "The Premium Plan targets high-net-worth growth through concentrated positions in real estate development, commodity futures, and high-yield corporate bonds.",
    allocation: [
      { asset: "Real Estate", pct: 35, color: "bg-amber-400" },
      { asset: "Commodities", pct: 25, color: "bg-[#00C853]" },
      { asset: "High-Yield Bonds", pct: 25, color: "bg-[#0A1628]" },
      { asset: "Private Equity", pct: 15, color: "bg-purple-400" },
    ],
    dailyHistory: [
      { date: "Oct 2", amount: 32.2 },
      { date: "Oct 1", amount: 32.2 },
      { date: "Sep 30", amount: 32.2 },
      { date: "Sep 29", amount: 32.2 },
      { date: "Sep 28", amount: 32.2 },
    ],
    risk: "Medium-High",
    manager: "Sarah Mitchell, CFA",
  },
  "starter-1": {
    name: "Starter Plan",
    tier: "Starter",
    invested: 2500,
    returns: 180,
    totalValue: 2680,
    roi: "7.2%",
    dailyReturn: 4.8,
    annualRate: "8–12%",
    duration: "3 months",
    startDate: "Aug 1, 2026",
    maturity: "Nov 1, 2026",
    progress: 85,
    status: "Active",
    description:
      "The Starter Plan is ideal for first-time investors. It offers low-risk exposure to government securities and money market instruments.",
    allocation: [
      { asset: "Government Securities", pct: 60, color: "bg-[#00C853]" },
      { asset: "Money Market", pct: 30, color: "bg-blue-400" },
      { asset: "Cash", pct: 10, color: "bg-slate-300" },
    ],
    dailyHistory: [
      { date: "Oct 2", amount: 4.8 },
      { date: "Oct 1", amount: 4.8 },
      { date: "Sep 30", amount: 4.8 },
      { date: "Sep 29", amount: 4.8 },
    ],
    risk: "Low",
    manager: "Rachel Kim",
  },
  "starter-old": {
    name: "Starter Plan",
    tier: "Starter",
    invested: 1000,
    returns: 96,
    totalValue: 1096,
    roi: "9.6%",
    dailyReturn: 0,
    annualRate: "8–12%",
    duration: "3 months",
    startDate: "Feb 1, 2026",
    maturity: "May 1, 2026",
    progress: 100,
    status: "Completed",
    description: "Completed starter investment.",
    allocation: [
      { asset: "Government Securities", pct: 60, color: "bg-[#00C853]" },
      { asset: "Money Market", pct: 40, color: "bg-blue-400" },
    ],
    dailyHistory: [],
    risk: "Low",
    manager: "Rachel Kim",
  },
};

export function generateStaticParams() {
  return Object.keys(planData).map((id) => ({ id }));
}

export default function InvestmentDetailPage({ params }) {
  const plan = planData[params.id] || planData["growth-1"];

  const tierColor = {
    Starter: "bg-blue-50 text-blue-600",
    Growth: "bg-[#E8FFF1] text-[#00C853]",
    Premium: "bg-amber-50 text-amber-600",
  }[plan.tier];

  const riskColor = {
    Low: "text-[#00C853]",
    Medium: "text-amber-500",
    "Medium-High": "text-orange-500",
    High: "text-red-500",
  }[plan.risk];

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link
          href="/investments"
          className="hover:text-[#00C853] transition-colors"
        >
          My Investments
        </Link>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-[#0A1628] font-medium">{plan.name}</span>
      </div>

      {/* Header card */}
      <div className="bg-[#0A1628] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tierColor}`}
              >
                {plan.tier}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${plan.status === "Active" ? "bg-[#E8FFF1] text-[#00C853]" : "bg-slate-700 text-slate-300"}`}
              >
                {plan.status}
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              {plan.startDate} → {plan.maturity} · {plan.duration}
            </p>
          </div>
          {plan.status === "Active" && (
            <Link
              href="/withdraw"
              className="self-start px-5 py-2.5 bg-[#00C853] text-white text-sm font-semibold rounded-xl hover:bg-[#00a844] transition-colors flex-shrink-0"
            >
              Withdraw Returns
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            {
              label: "Amount Invested",
              val: `$${plan.invested.toLocaleString()}`,
              color: "text-white",
            },
            {
              label: "Returns Earned",
              val: `+$${plan.returns.toLocaleString()}`,
              color: "text-[#00C853]",
            },
            {
              label: "Total Value",
              val: `$${plan.totalValue.toLocaleString()}`,
              color: "text-[#00C853]",
            },
            { label: "ROI Achieved", val: plan.roi, color: "text-[#00C853]" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">{s.label}</p>
              <p className={`font-bold text-lg ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#0A1628] mb-4">
              Investment Progress
            </h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Duration Progress</span>
              <span className="font-semibold text-[#0A1628]">
                {plan.progress}% complete
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#00C853] to-[#00a844] rounded-full transition-all"
                style={{ width: `${plan.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{plan.startDate}</span>
              <span>{plan.maturity}</span>
            </div>
            {plan.status === "Active" && (
              <div className="mt-4 bg-[#E8FFF1] rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00C853] flex items-center justify-center flex-shrink-0">
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
                  <p className="text-[#0A1628] font-semibold text-sm">
                    Daily return: +${plan.dailyReturn}
                  </p>
                  <p className="text-slate-500 text-xs">
                    Credited to your wallet every day
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#0A1628] mb-3">About this Plan</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {plan.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400">Annual Rate</p>
                <p className="font-semibold text-[#00C853]">
                  {plan.annualRate}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Risk Level</p>
                <p className={`font-semibold ${riskColor}`}>{plan.risk}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Portfolio Manager</p>
                <p className="font-semibold text-[#0A1628] text-sm">
                  {plan.manager}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Plan Duration</p>
                <p className="font-semibold text-[#0A1628]">{plan.duration}</p>
              </div>
            </div>
          </div>

          {/* Daily returns history */}
          {plan.dailyHistory.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0A1628] mb-4">
                Recent Daily Returns
              </h2>
              <div className="divide-y divide-slate-100">
                {plan.dailyHistory.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E8FFF1] flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#00C853]"
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
                        <p className="text-sm font-medium text-[#0A1628]">
                          Daily ROI Credit
                        </p>
                        <p className="text-xs text-slate-400">{d.date}</p>
                      </div>
                    </div>
                    <p className="text-[#00C853] font-semibold text-sm">
                      +${d.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Asset allocation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#0A1628] mb-4">Asset Allocation</h2>
            {/* Simple bar chart */}
            <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
              {plan.allocation.map((a) => (
                <div
                  key={a.asset}
                  className={`${a.color} transition-all`}
                  style={{ width: `${a.pct}%` }}
                  title={`${a.asset}: ${a.pct}%`}
                />
              ))}
            </div>
            <div className="space-y-3">
              {plan.allocation.map((a) => (
                <div
                  key={a.asset}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                    <span className="text-sm text-slate-600">{a.asset}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#0A1628]">
                    {a.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#0A1628] mb-4">Actions</h2>
            <div className="space-y-2">
              {plan.status === "Active" && (
                <>
                  <Link
                    href="/withdraw"
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-[#00C853] hover:text-[#00C853] transition-colors"
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
                        strokeWidth={1.8}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Withdraw Returns
                  </Link>
                  <Link
                    href="/investments"
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-[#00C853] hover:text-[#00C853] transition-colors"
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
                        strokeWidth={1.8}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Top Up Investment
                  </Link>
                </>
              )}
              {plan.status === "Completed" && (
                <Link
                  href="/investments"
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[#00C853] text-white text-sm font-semibold hover:bg-[#00a844] transition-colors"
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
                      strokeWidth={1.8}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reinvest Returns
                </Link>
              )}
              <Link
                href="/transactions"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-[#00C853] hover:text-[#00C853] transition-colors"
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
                    strokeWidth={1.8}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Transaction History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
