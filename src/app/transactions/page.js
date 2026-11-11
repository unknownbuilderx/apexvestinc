"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { transactionAPI } from "@/lib/api";

const typeConfig = {
  Deposit: {
    color: "text-[#00C853]",
    bg: "bg-[#E8FFF1]",
    icon: "💳",
    sign: "+",
  },
  Return: { color: "text-[#00C853]", bg: "bg-blue-50", icon: "📈", sign: "+" },
  Withdrawal: { color: "text-red-500", bg: "bg-red-50", icon: "🏦", sign: "" },
  Investment: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: "📊",
    sign: "",
  },
  "Referral Bonus": {
    color: "text-[#00C853]",
    bg: "bg-[#E8FFF1]",
    icon: "🎁",
    sign: "+",
  },
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTransactions = async () => {
      try {
        const firstPage = await transactionAPI.getAll({ limit: 100 });
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(0, (firstPage.pages || 1) - 1) }, (_, index) =>
            transactionAPI.getAll({ limit: 100, page: index + 2 }),
          ),
        );
        if (active) {
          setTransactions([
            ...(firstPage.transactions || []),
            ...remainingPages.flatMap((page) => page.transactions || []),
          ]);
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTransactions();
    return () => {
      active = false;
    };
  }, []);

  const allTransactions = transactions.map((transaction) => {
    const createdAt = new Date(transaction.createdAt);
    const isOutgoing = ["Withdrawal", "Investment"].includes(transaction.type);
    const amount = Math.abs(Number(transaction.amount) || 0);
    return {
      id: transaction.reference || transaction._id,
      type: transaction.type,
      desc: transaction.description || transaction.paymentMethod || transaction.type,
      plan: transaction.investment?.planName
        ? `${transaction.investment.planName} Plan`
        : "—",
      date: createdAt.toLocaleDateString(),
      time: createdAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: isOutgoing ? -amount : amount,
      status: transaction.status,
    };
  });

  const filters = [
    "All",
    "Deposit",
    "Return",
    "Withdrawal",
    "Investment",
    "Referral Bonus",
  ];

  const filtered = allTransactions.filter((t) => {
    const matchFilter = filter === "All" || t.type === filter;
    const matchSearch =
      !search ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.plan.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totals = {
    deposits: allTransactions
      .filter((t) => t.type === "Deposit")
      .reduce((s, t) => s + t.amount, 0),
    returns: allTransactions
      .filter((t) => t.type === "Return")
      .reduce((s, t) => s + t.amount, 0),
    withdrawals: Math.abs(
      allTransactions
        .filter((t) => t.type === "Withdrawal")
        .reduce((s, t) => s + t.amount, 0),
    ),
    investments: Math.abs(
      allTransactions
        .filter((t) => t.type === "Investment")
        .reduce((s, t) => s + t.amount, 0),
    ),
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628]">Transactions</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Full history of all account activity
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Deposited",
            val: `$${totals.deposits.toLocaleString()}`,
            color: "text-[#00C853]",
          },
          {
            label: "Total Returns",
            val: `$${totals.returns.toFixed(2)}`,
            color: "text-[#00C853]",
          },
          {
            label: "Total Withdrawn",
            val: `$${totals.withdrawals.toLocaleString()}`,
            color: "text-red-500",
          },
          {
            label: "Invested",
            val: `$${totals.investments.toLocaleString()}`,
            color: "text-amber-600",
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

      {/* Filters + search */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 border-b border-slate-100">
          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-[#0A1628] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-56">
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
              placeholder="Search transactions..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
          </div>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">Type</div>
          <div className="col-span-2">ID</div>
          <div className="col-span-3">Description</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1 text-right">Amount</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <p className="py-16 text-center text-slate-400">Loading transactions…</p>
          ) : error ? (
            <p className="py-16 text-center text-red-500">{error}</p>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="font-medium">No transactions found</p>
              <p className="text-xs mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            filtered.map((t) => {
              const cfg = typeConfig[t.type];
              const isPositive = t.amount > 0;
              return (
                <div
                  key={t.id}
                  className="px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg} flex-shrink-0`}
                      >
                        <span className="text-sm">{cfg.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#0A1628] text-sm">
                          {t.type}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {t.desc} · {t.date}
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            t.status === "Completed"
                              ? "bg-[#E8FFF1] text-[#00C853]"
                              : ["Failed", "Reversed"].includes(t.status)
                                ? "bg-red-50 text-red-500"
                                : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {t.status}
                        </span>
                        {t.plan !== "—" && (
                          <p className="text-xs text-slate-400">{t.plan}</p>
                        )}
                      </div>
                    </div>
                    <p className={`font-bold text-sm ${cfg.color}`}>
                      {isPositive
                        ? `+$${t.amount.toFixed(2)}`
                        : `-$${Math.abs(t.amount).toLocaleString()}`}
                    </p>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 items-center text-sm">
                    <div className="col-span-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg}`}
                      >
                        <span className="text-xs">{cfg.icon}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-mono text-xs text-slate-500">{t.id}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-medium text-[#0A1628] text-sm truncate">
                        {t.desc}
                      </p>
                      <p className="text-xs text-slate-400">{t.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 truncate">
                        {t.plan}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-600">{t.date}</p>
                    </div>
                    <div className="col-span-1 text-right">
                      <p className={`font-bold text-sm ${cfg.color}`}>
                        {isPositive
                          ? `+$${t.amount.toFixed(2)}`
                          : `-$${Math.abs(t.amount).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="col-span-1 text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          t.status === "Completed"
                            ? "bg-[#E8FFF1] text-[#00C853]"
                            : ["Failed", "Reversed"].includes(t.status)
                              ? "bg-red-50 text-red-500"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400">
            Showing {filtered.length} of {allTransactions.length} transactions
          </p>
          <button className="text-xs text-[#00C853] font-medium hover:underline">
            Export CSV
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
