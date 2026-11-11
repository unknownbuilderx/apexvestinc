"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

const plans = [
  {
    id: "growth-1",
    name: "Growth Plan",
    tier: "Growth",
    invested: 25000,
    returns: 4820,
    roi: "19.3%",
    dailyReturn: 48.5,
    duration: "6 months",
    startDate: "Jun 15, 2026",
    maturity: "Dec 15, 2026",
    progress: 68,
    status: "Active",
    description: "Mid-tier plan with balanced risk and strong returns across diversified equities and fixed income.",
  },
  {
    id: "premium-1",
    name: "Premium Plan",
    tier: "Premium",
    invested: 15000,
    returns: 3600,
    roi: "24.0%",
    dailyReturn: 32.2,
    duration: "12 months",
    startDate: "Mar 3, 2026",
    maturity: "Mar 3, 2027",
    progress: 42,
    status: "Active",
    description: "High-growth plan with exposure to real estate, commodities, and high-yield bonds.",
  },
  {
    id: "starter-1",
    name: "Starter Plan",
    tier: "Starter",
    invested: 2500,
    returns: 180,
    roi: "7.2%",
    dailyReturn: 4.8,
    duration: "3 months",
    startDate: "Aug 1, 2026",
    maturity: "Nov 1, 2026",
    progress: 85,
    status: "Active",
    description: "Entry-level plan for new investors. Low risk, steady daily returns.",
  },
  {
    id: "starter-old",
    name: "Starter Plan",
    tier: "Starter",
    invested: 1000,
    returns: 96,
    roi: "9.6%",
    dailyReturn: 0,
    duration: "3 months",
    startDate: "Feb 1, 2026",
    maturity: "May 1, 2026",
    progress: 100,
    status: "Completed",
    description: "Entry-level plan for new investors.",
  },
];

const tierColors = {
  Starter: "bg-blue-50 text-blue-600",
  Growth: "bg-[#E8FFF1] text-[#00C853]",
  Premium: "bg-amber-50 text-amber-600",
};

const newPlans = [
  { tier: "Starter", minInvest: "$500", roi: "8–12%", duration: "3 months", popular: false },
  { tier: "Growth", minInvest: "$2,500", roi: "14–20%", duration: "6 months", popular: true },
  { tier: "Premium", minInvest: "$10,000", roi: "22–35%", duration: "12 months", popular: false },
];

export default function InvestmentsPage() {
  const [tab, setTab] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");

  const filtered = plans.filter((p) =>
    tab === "active" ? p.status === "Active" : p.status === "Completed"
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">My Investments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage and monitor all your active investment plans</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#00C853] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#00a844] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Investment
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Invested", val: "$42,500.00" },
          { label: "Total Returns", val: "$8,696.00", green: true },
          { label: "Active Plans", val: "3" },
          { label: "Completed Plans", val: "1" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.green ? "text-[#00C853]" : "text-[#0A1628]"}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {["active", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              tab === t ? "bg-[#0A1628] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t} ({plans.filter((p) => p.status === (t === "active" ? "Active" : "Completed")).length})
          </button>
        ))}
      </div>

      {/* Plans list */}
      <div className="space-y-4">
        {filtered.map((plan) => (
          <div key={plan.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Icon + name */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[#0A1628]">{plan.name}</p>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tierColors[plan.tier]}`}>{plan.tier}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${plan.status === "Active" ? "bg-[#E8FFF1] text-[#00C853]" : "bg-slate-100 text-slate-500"}`}>
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{plan.startDate} → {plan.maturity} · {plan.duration}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Invested</p>
                  <p className="font-bold text-[#0A1628]">${plan.invested.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Returns Earned</p>
                  <p className="font-bold text-[#00C853]">+${plan.returns.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">ROI</p>
                  <p className="font-bold text-[#00C853]">{plan.roi}</p>
                </div>
                {plan.status === "Active" && (
                  <div>
                    <p className="text-xs text-slate-400">Daily Return</p>
                    <p className="font-bold text-[#0A1628]">+${plan.dailyReturn}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress + CTA */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Duration progress</span>
                  <span>{plan.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${plan.status === "Completed" ? "bg-slate-400" : "bg-[#00C853]"}`}
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/investments/${plan.id}`}
                className="flex-shrink-0 text-xs font-semibold text-[#00C853] border border-[#00C853] px-4 py-2 rounded-lg hover:bg-[#E8FFF1] transition-colors"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* New Investment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0A1628]">Start a New Investment</h2>
              <button onClick={() => { setShowModal(false); setSelectedPlan(null); setAmount(""); }} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {!selectedPlan ? (
                <>
                  <p className="text-sm text-slate-500 mb-4">Select a plan to get started:</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {newPlans.map((p) => (
                      <button
                        key={p.tier}
                        onClick={() => setSelectedPlan(p)}
                        className="relative border-2 border-slate-200 hover:border-[#00C853] rounded-xl p-4 text-left transition-all"
                      >
                        {p.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#00C853] text-white text-xs font-bold px-3 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <p className="font-bold text-[#0A1628] mb-1">{p.tier}</p>
                        <p className="text-[#00C853] text-sm font-semibold">{p.roi} ROI</p>
                        <p className="text-slate-400 text-xs mt-1">Min. {p.minInvest} · {p.duration}</p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => setSelectedPlan(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#00C853] mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to plans
                  </button>
                  <div className="bg-slate-50 rounded-xl p-4 mb-5">
                    <p className="font-bold text-[#0A1628]">{selectedPlan.tier} Plan</p>
                    <p className="text-[#00C853] font-semibold text-sm">{selectedPlan.roi} Annual ROI · {selectedPlan.duration}</p>
                  </div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Investment Amount (USD)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min. ${selectedPlan.minInvest}`}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853] mb-4"
                  />
                  {amount && (
                    <div className="bg-[#E8FFF1] border border-[#00C853]/20 rounded-xl p-4 mb-4 text-sm">
                      <p className="text-slate-600">Estimated returns at maturity:</p>
                      <p className="text-[#00C853] font-bold text-lg mt-1">
                        +${(parseFloat(amount) * 0.17).toFixed(2)}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">Based on mid-range ROI estimate</p>
                    </div>
                  )}
                  <button
                    onClick={() => { setShowModal(false); setSelectedPlan(null); setAmount(""); }}
                    className="w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm"
                  >
                    Confirm Investment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
