"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { withdrawalAPI } from "@/lib/api";

const statusConfig = {
  Completed: { color: "bg-[#E8FFF1] text-[#00C853]", dot: "bg-[#00C853]" },
  Processing: { color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  Pending: { color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  Failed: { color: "bg-red-50 text-red-500", dot: "bg-red-400" },
  Reversed: { color: "bg-red-50 text-red-500", dot: "bg-red-400" },
};

export default function WithdrawalHistoryPage() {
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadWithdrawals = async () => {
      try {
        const firstPage = await withdrawalAPI.getAll({ limit: 100 });
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, (firstPage.pages || 1) - 1) }, (_, index) =>
            withdrawalAPI.getAll({ limit: 100, page: index + 2 }),
          ),
        );
        if (active) {
          setRecords([
            ...(firstPage.withdrawals || []),
            ...remainingPages.flatMap((page) => page.withdrawals || []),
          ]);
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWithdrawals();
    return () => {
      active = false;
    };
  }, []);

  const withdrawals = records.map((withdrawal) => {
    const createdAt = new Date(withdrawal.createdAt);
    return {
      id: withdrawal.reference || withdrawal._id,
      date: createdAt.toLocaleDateString(),
      time: createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: Number(withdrawal.amount) || 0,
      bank: withdrawal.bankName || "—",
      accountNo: `••••${withdrawal.accountNumber?.slice(-4) || "—"}`,
      status: withdrawal.status,
      plan: withdrawal.investment?.planName
        ? `${withdrawal.investment.planName} Plan`
        : "—",
      ref: withdrawal.transaction?.reference || withdrawal.reference || withdrawal._id,
    };
  });

  const filtered = withdrawals.filter(
    (w) =>
      !search ||
      w.id.toLowerCase().includes(search.toLowerCase()) ||
      w.bank.toLowerCase().includes(search.toLowerCase()) ||
      w.plan.toLowerCase().includes(search.toLowerCase()),
  );

  const totalWithdrawn = withdrawals.reduce((s, w) => s + w.amount, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">
            Withdrawal History
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            All your past withdrawal requests
          </p>
        </div>
        <Link
          href="/withdraw"
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
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          New Withdrawal
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Withdrawn",
            val: `$${totalWithdrawn.toLocaleString()}`,
            color: "text-[#0A1628]",
          },
          {
            label: "Withdrawals Made",
            val: withdrawals.length.toString(),
            color: "text-[#0A1628]",
          },
          {
            label: "Completed",
            val: withdrawals
              .filter((w) => w.status === "Completed")
              .length.toString(),
            color: "text-[#00C853]",
          },
          {
            label: "Avg. Amount",
            val: `$${(totalWithdrawn / (withdrawals.length || 1)).toFixed(0)}`,
            color: "text-[#0A1628]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
          >
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, bank, plan..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
          </div>
          <button className="text-xs text-[#00C853] font-medium hover:underline flex-shrink-0">
            Export CSV
          </button>
        </div>

        {/* Column headers — desktop */}
        <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-3">Reference ID</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Bank</div>
          <div className="col-span-2">Source Plan</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <p className="py-16 text-center text-slate-400">Loading withdrawals…</p>
          ) : error ? (
            <p className="py-16 text-center text-red-500">{error}</p>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="font-medium">No withdrawals found</p>
            </div>
          ) : (
            filtered.map((w) => {
              const sc = statusConfig[w.status] || statusConfig.Pending;
              return (
                <div
                  key={w.id}
                  className="px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Mobile */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div>
                      <p className="font-mono text-xs text-slate-500 mb-0.5">
                        {w.id}
                      </p>
                      <p className="font-semibold text-[#0A1628] text-sm">
                        {w.bank} · {w.accountNo}
                      </p>
                      <p className="text-xs text-slate-400">
                        {w.plan} · {w.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500">
                        -${w.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sc.color}`}
                      >
                        {w.status}
                      </span>
                    </div>
                  </div>
                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 items-center text-sm">
                    <div className="col-span-3">
                      <p className="font-mono text-xs text-slate-600 font-semibold">
                        {w.id}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ref: {w.ref}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-[#0A1628]">{w.date}</p>
                      <p className="text-xs text-slate-400">{w.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-[#0A1628] text-sm">
                        {w.bank}
                      </p>
                      <p className="text-xs text-slate-400">{w.accountNo}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">{w.plan}</p>
                    </div>
                    <div className="col-span-1 text-right">
                      <p className="font-bold text-red-500">
                        -${w.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${sc.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        />
                        {w.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <p className="text-xs text-slate-400">
            Showing {filtered.length} of {withdrawals.length} withdrawals
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Total:{" "}
            <span className="text-red-500 font-bold">
              ${totalWithdrawn.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
