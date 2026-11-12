"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { adminAPI, messageAPI } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = {
  Active: "bg-[#E8FFF1] text-[#00C853]",
  Suspended: "bg-red-50 text-red-500",
  Inactive: "bg-slate-100 text-slate-500",
};
const kycColor = {
  Verified: "bg-[#E8FFF1] text-[#00C853]",
  Pending: "bg-amber-50 text-amber-600",
  Rejected: "bg-red-50 text-red-500",
};
const tierMap = (investments = []) => {
  if (!investments.length) return "—";
  const hasP = investments.some((i) => i.planName === "Premium");
  const hasG = investments.some((i) => i.planName === "Growth");
  return hasP ? "Premium" : hasG ? "Growth" : "Starter";
};
const tierColor = {
  Starter: "bg-blue-50 text-blue-600",
  Growth: "bg-[#E8FFF1] text-[#00C853]",
  Premium: "bg-amber-50 text-amber-600",
  "—": "bg-slate-100 text-slate-400",
};
const fmt = (n) => (n ?? 0).toLocaleString();

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, highlight }) {
  return (
    <div
      className={`rounded-2xl p-5 border shadow-sm ${highlight ? "bg-[#0A1628] border-transparent" : "bg-white border-slate-100"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          className={`text-xs font-medium ${highlight ? "text-slate-400" : "text-slate-500"}`}
        >
          {label}
        </p>
        <span className="text-xl">{icon}</span>
      </div>
      <p
        className={`text-2xl font-bold ${highlight ? "text-white" : "text-[#0A1628]"}`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-xs mt-1 font-medium ${highlight ? "text-slate-400" : "text-[#00C853]"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function HistoryEditForm({ kind, record, onCancel, onSave }) {
  const toLocalDatetime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [form, setForm] = useState(() =>
    kind === "deposit"
      ? {
          amount: record.amount ?? "",
          status: record.status || "Completed",
          description: record.description || "",
          paymentMethod: record.paymentMethod || "",
          bankName: record.bankName || "",
          accountLast4: record.accountLast4 || "",
          createdAt: toLocalDatetime(record.createdAt),
        }
      : {
          amount: record.amount ?? "",
          fee: record.fee ?? 0,
          status: record.status || "Pending",
          bankName: record.bankName || "",
          accountName: record.accountName || "",
          accountNumber: record.accountNumber || "",
          routingNumber: record.routingNumber || "",
          adminNote: record.adminNote || "",
        },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C853]";
  const fields =
    kind === "deposit"
      ? [
          { key: "amount", label: "Amount ($)", type: "number", min: "0.01" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              "Pending",
              "Processing",
              "Completed",
              "Failed",
              "Reversed",
            ],
          },
          { key: "description", label: "Description" },
          { key: "paymentMethod", label: "Payment method" },
          { key: "bankName", label: "Bank name" },
          { key: "accountLast4", label: "Account last 4" },
          { key: "createdAt", label: "Date & Time", type: "datetime-local" },
        ]
      : [
          { key: "amount", label: "Amount ($)", type: "number", min: "50" },
          { key: "fee", label: "Fee ($)", type: "number", min: "0" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              "Pending",
              "Processing",
              "Completed",
              "Failed",
              "Reversed",
            ],
          },
          { key: "bankName", label: "Bank name" },
          { key: "accountName", label: "Account name" },
          { key: "accountNumber", label: "Account number" },
          { key: "routingNumber", label: "Routing number" },
          { key: "adminNote", label: "Admin note" },
        ];

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
        ...(kind === "withdrawal" ? { fee: Number(form.fee) } : {}),
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-3 rounded-xl bg-slate-50 p-3 space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => (
          <label key={field.key} className="text-xs font-medium text-slate-600">
            {field.label}
            {field.type === "select" ? (
              <select
                value={form[field.key]}
                onChange={(event) => set(field.key, event.target.value)}
                className={`${inputClass} mt-1`}
              >
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                min={field.min}
                step={field.type === "number" ? "0.01" : undefined}
                value={form[field.key]}
                onChange={(event) => set(field.key, event.target.value)}
                className={`${inputClass} mt-1`}
              />
            )}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#00C853] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Add Transaction Form ─────────────────────────────────────────────────────
function AddTransactionForm({ userId, onCancel, onSave }) {
  const now = new Date();
  const localDatetime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  const [form, setForm] = useState({
    type: "Deposit",
    amount: "",
    description: "",
    status: "Completed",
    bankName: "",
    accountLast4: "",
    paymentMethod: "",
    createdAt: localDatetime,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C853]";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await adminAPI.createTransaction(userId, {
        ...form,
        amount: Number(form.amount),
      });
      onSave(res.transaction, res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-xl border border-[#00C853]/30 bg-[#E8FFF1] p-4 space-y-3"
    >
      <p className="text-xs font-bold text-[#0A1628] uppercase tracking-wider">
        New Transaction Entry
      </p>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-medium text-slate-600 col-span-2 sm:col-span-1">
          Type
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className={`${inputClass} mt-1`}
          >
            {[
              "Deposit",
              "Withdrawal",
              "Return",
              "Investment",
              "Referral Bonus",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600 col-span-2 sm:col-span-1">
          Status
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className={`${inputClass} mt-1`}
          >
            {["Completed", "Pending", "Processing", "Failed", "Reversed"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-600 col-span-2 sm:col-span-1">
          Amount ($)
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="text-xs font-medium text-slate-600 col-span-2 sm:col-span-1">
          Date &amp; Time
          <input
            type="datetime-local"
            value={form.createdAt}
            onChange={(e) => set("createdAt", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="text-xs font-medium text-slate-600 col-span-2">
          Description
          <input
            type="text"
            required
            placeholder="e.g. Bank Transfer, Interest Payment…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="text-xs font-medium text-slate-600">
          Bank Name
          <input
            type="text"
            value={form.bankName}
            onChange={(e) => set("bankName", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="text-xs font-medium text-slate-600">
          Account Last 4
          <input
            type="text"
            maxLength={4}
            value={form.accountLast4}
            onChange={(e) => set("accountLast4", e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#00C853] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}

// ─── User detail modal ────────────────────────────────────────────────────────
function UserModal({
  userId,
  onClose,
  onUpdate,
  onEditMetrics,
  onEditBalance,
  onEditGrowth,
  onEditPending,
}) {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    adminAPI
      .getUserById(userId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [userId]);

  const updateStatus = async (newStatus) => {
    setSaving(true);
    try {
      const res = await adminAPI.updateUser(userId, { status: newStatus });
      setData((d) => ({ ...d, user: res.user }));
      onUpdate();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateKyc = async (kycStatus) => {
    setSaving(true);
    try {
      const res = await adminAPI.updateUser(userId, {
        kyc: { status: kycStatus },
      });
      setData((d) => ({ ...d, user: res.user }));
      onUpdate();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Permanently delete this user and all their data? This cannot be undone.",
      )
    )
      return;
    setDeleting(true);
    try {
      await adminAPI.deleteUser(userId);
      onUpdate();
      onClose();
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  };

  const saveDeposit = async (transactionId, updates) => {
    const res = await adminAPI.updateDepositTransaction(transactionId, updates);
    setData((current) => ({
      ...current,
      user: res.user,
      transactions: current.transactions.map((transaction) =>
        transaction._id === transactionId ? res.transaction : transaction,
      ),
    }));
    setEditingHistory(null);
    onUpdate();
  };

  const saveWithdrawal = async (withdrawalId, updates) => {
    const res = await adminAPI.updateWithdrawalDetails(withdrawalId, updates);
    setData((current) => ({
      ...current,
      user: res.user,
      withdrawals: current.withdrawals.map((withdrawal) =>
        withdrawal._id === withdrawalId ? res.withdrawal : withdrawal,
      ),
    }));
    setEditingHistory(null);
    onUpdate();
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (
      !confirm(
        "Delete this transaction entry? This may adjust the user's wallet balance.",
      )
    )
      return;
    try {
      const res = await adminAPI.deleteTransaction(transactionId);
      setData((d) => ({
        ...d,
        user: res.user,
        transactions: d.transactions.filter((t) => t._id !== transactionId),
      }));
      onUpdate();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!data && !error)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-3 shadow-2xl">
          <svg
            className="w-8 h-8 animate-spin text-[#00C853]"
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
          <p className="text-slate-500 text-sm">Loading user…</p>
        </div>
      </div>
    );

  const u = data?.user;
  const investments = data?.investments || [];
  const deposits = data?.transactions || [];
  const withdrawals = data?.withdrawals || [];
  const activeInvestments = investments.filter((i) => i.status === "Active");
  const totalInvested =
    u?.totalInvestedOverride ??
    activeInvestments.reduce((s, i) => s + (i.amountInvested || 0), 0);
  const totalReturns =
    u?.totalReturnsOverride ??
    activeInvestments.reduce((s, i) => s + (i.returnsEarned || 0), 0);
  const tier = tierMap(investments);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0A1628] text-white font-bold flex items-center justify-center text-sm">
              {u ? `${u.firstName?.[0]}${u.lastName?.[0]}` : "?"}
            </div>
            <div>
              <p className="font-bold text-[#0A1628]">
                {u ? `${u.firstName} ${u.lastName}` : "—"}
              </p>
              <p className="text-xs text-slate-400 font-mono">{u?._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {u && (
            <>
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[u.status]}`}
                >
                  {u.status}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${kycColor[u.kyc?.status]}`}
                >
                  KYC: {u.kyc?.status}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${tierColor[tier]}`}
                >
                  {tier}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Email", val: u.email },
                  { label: "Phone", val: u.phone || "—" },
                  { label: "Country", val: u.country || "—" },
                  {
                    label: "Joined",
                    val: new Date(u.createdAt).toLocaleDateString(),
                  },
                  { label: "Wallet Balance", val: `$${fmt(u.walletBalance)}` },
                  { label: "Total Invested", val: `$${fmt(totalInvested)}` },
                  { label: "Total Returns", val: `$${fmt(totalReturns)}` },
                  {
                    label: "Active Plans",
                    val: u?.activePlansOverride ?? activeInvestments.length,
                  },
                ].map((r) => (
                  <div key={r.label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{r.label}</p>
                    <p className="font-semibold text-[#0A1628] text-sm truncate">
                      {r.val}
                    </p>
                  </div>
                ))}
              </div>

              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Dashboard Controls
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onEditMetrics(u, investments)}
                    className="text-left rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    Edit Invested, Returns &amp; Active Plans
                  </button>
                  <button
                    onClick={() => onEditBalance(u)}
                    className="text-left rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-100"
                  >
                    Edit Wallet Balance
                  </button>
                  <button
                    onClick={() => onEditGrowth(u)}
                    className="text-left rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800 hover:bg-violet-100"
                  >
                    Edit Portfolio Growth Chart
                  </button>
                  <button
                    onClick={() => onEditPending(u)}
                    className="text-left rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                  >
                    Edit Pending Investment
                  </button>
                </div>
              </section>

              {/* Actions */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Account Actions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      updateStatus(
                        u.status === "Active" ? "Suspended" : "Active",
                      )
                    }
                    disabled={saving}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${u.status === "Active" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-[#E8FFF1] text-[#00C853] hover:bg-[#d4ffe4]"}`}
                  >
                    {u.status === "Active"
                      ? "Suspend Account"
                      : "Reactivate Account"}
                  </button>
                  <button
                    onClick={() =>
                      updateKyc(
                        u.kyc?.status === "Verified" ? "Pending" : "Verified",
                      )
                    }
                    disabled={saving}
                    className="py-2.5 rounded-xl text-sm font-semibold bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {u.kyc?.status === "Verified"
                      ? "Revoke KYC"
                      : "Approve KYC"}
                  </button>
                  <button
                    onClick={() =>
                      adminAPI.updateUser(u._id, { status: "Inactive" })
                    }
                    className="py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors col-span-2"
                  >
                    Mark Inactive
                  </button>
                </div>
              </div>

              {/* Recent investments */}
              {investments.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Investments
                  </p>
                  <div className="space-y-2">
                    {investments.slice(0, 3).map((inv) => (
                      <div
                        key={inv._id}
                        className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-[#0A1628]">
                          {inv.planName} Plan
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">
                            ${fmt(inv.amountInvested)}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inv.status === "Active" ? "bg-[#E8FFF1] text-[#00C853]" : "bg-slate-100 text-slate-500"}`}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Transaction History
                  </h3>
                  <button
                    onClick={() => setShowAddTransaction(true)}
                    className="text-xs font-semibold text-white bg-[#00C853] hover:bg-[#00a844] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Entry
                  </button>
                </div>

                {showAddTransaction && (
                  <AddTransactionForm
                    userId={u._id}
                    onCancel={() => setShowAddTransaction(false)}
                    onSave={(newTxn, updatedUser) => {
                      setData((d) => ({
                        ...d,
                        user: updatedUser,
                        transactions: [newTxn, ...(d.transactions || [])],
                      }));
                      setShowAddTransaction(false);
                      onUpdate();
                    }}
                  />
                )}

                {deposits.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
                    No transaction history
                  </p>
                ) : (
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {deposits.map((transaction) => {
                      const isOut = ["Withdrawal", "Investment"].includes(
                        transaction.type,
                      );
                      return (
                        <div
                          key={transaction._id}
                          className="rounded-xl border border-slate-100 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`font-semibold ${isOut ? "text-red-500" : "text-[#00C853]"}`}
                                >
                                  {isOut ? "-" : "+"}${fmt(transaction.amount)}
                                </span>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {transaction.type}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${transaction.status === "Completed" ? "bg-[#E8FFF1] text-[#00C853]" : transaction.status === "Failed" || transaction.status === "Reversed" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}
                                >
                                  {transaction.status}
                                </span>
                              </div>
                              <p className="mt-1 truncate text-xs text-slate-500">
                                {transaction.description}
                                {transaction.bankName
                                  ? ` · ${transaction.bankName}`
                                  : ""}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {new Date(
                                  transaction.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() =>
                                  setEditingHistory({
                                    kind: "deposit",
                                    id: transaction._id,
                                  })
                                }
                                className="text-xs font-semibold text-blue-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTransaction(transaction._id)
                                }
                                className="text-xs font-semibold text-red-400 hover:text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {editingHistory?.kind === "deposit" &&
                            editingHistory.id === transaction._id && (
                              <HistoryEditForm
                                kind="deposit"
                                record={transaction}
                                onCancel={() => setEditingHistory(null)}
                                onSave={(updates) =>
                                  saveDeposit(transaction._id, updates)
                                }
                              />
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Withdrawal History
                </h3>
                {withdrawals.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
                    No withdrawal history
                  </p>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto">
                    {withdrawals.map((withdrawal) => (
                      <div
                        key={withdrawal._id}
                        className="rounded-xl border border-slate-100 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-red-500">
                                -${fmt(withdrawal.amount)}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${withdrawal.status === "Completed" ? "bg-[#E8FFF1] text-[#00C853]" : withdrawal.status === "Failed" || withdrawal.status === "Reversed" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}
                              >
                                {withdrawal.status}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {withdrawal.bankName} · {withdrawal.accountName} ·
                              {" ••••"}
                              {withdrawal.accountNumber?.slice(-4)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(withdrawal.createdAt).toLocaleString()}
                              {withdrawal.adminNote
                                ? ` · ${withdrawal.adminNote}`
                                : ""}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setEditingHistory({
                                kind: "withdrawal",
                                id: withdrawal._id,
                              })
                            }
                            className="shrink-0 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        {editingHistory?.kind === "withdrawal" &&
                          editingHistory.id === withdrawal._id && (
                            <HistoryEditForm
                              kind="withdrawal"
                              record={withdrawal}
                              onCancel={() => setEditingHistory(null)}
                              onSave={(updates) =>
                                saveWithdrawal(withdrawal._id, updates)
                              }
                            />
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Danger */}
              <div className="border border-red-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">
                  Danger Zone
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-sm text-red-500 font-medium hover:underline disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Permanently Delete Account"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // { _id, firstName, lastName, email }
  const [thread, setThread] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getMessages();
      setConversations(res.conversations || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const openThread = async (conv) => {
    const user = conv._id;
    setSelectedUser(user);
    setThreadLoading(true);
    try {
      const res = await adminAPI.getThread(user._id);
      setThread(res.messages || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await adminAPI.replyToUser(selectedUser._id, {
        body: reply.trim(),
      });
      setThread((t) => [...t, res.message]);
      setReply("");
      loadConversations();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMsg = async (msgId) => {
    if (!confirm("Delete this message?")) return;
    try {
      await adminAPI.deleteMessage(msgId);
      setThread((t) => t.filter((m) => m._id !== msgId));
      loadConversations();
    } catch (e) {
      setError(e.message);
    }
  };

  const fmt = (d) =>
    new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0A1628]">Messages</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          User support conversations
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      <div className="grid lg:grid-cols-5 gap-4 h-[72vh]">
        {/* Conversation list */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-bold text-[#0A1628] text-sm">
              Conversations ({conversations.length})
            </p>
            <button
              onClick={loadConversations}
              className="text-xs text-[#00C853] hover:underline"
            >
              ↻ Refresh
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <svg
                className="w-6 h-6 animate-spin text-[#00C853]"
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
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.map((conv) => {
                const user = conv._id;
                const last = conv.lastMessage;
                const isSelected = selectedUser?._id === user?._id;
                return (
                  <button
                    key={user?._id}
                    onClick={() => openThread(conv)}
                    className={`w-full px-4 py-3.5 text-left hover:bg-slate-50 transition-colors ${isSelected ? "bg-[#E8FFF1] border-l-2 border-[#00C853]" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[#0A1628] text-sm truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-[#00C853] text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {last?.senderRole === "admin" ? "You: " : ""}
                          {last?.body}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {fmt(last?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Thread pane */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-4xl mb-3">💬</p>
                <p className="font-medium text-[#0A1628]">
                  Select a conversation
                </p>
                <p className="text-sm mt-1">
                  Click a user on the left to view messages
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center">
                  {selectedUser.firstName?.[0]}
                  {selectedUser.lastName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-[#0A1628] text-sm">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="ml-auto text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {threadLoading ? (
                  <div className="flex items-center justify-center py-10 text-slate-400">
                    <svg
                      className="w-6 h-6 animate-spin text-[#00C853]"
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
                  </div>
                ) : thread.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-10">
                    No messages in this thread
                  </p>
                ) : (
                  thread.map((msg) => {
                    const isAdmin = msg.senderRole === "admin";
                    return (
                      <div
                        key={msg._id}
                        className={`flex gap-2 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isAdmin ? "bg-[#00C853] text-white" : "bg-[#0A1628] text-white"}`}
                        >
                          {isAdmin
                            ? "A"
                            : `${selectedUser.firstName?.[0]}${selectedUser.lastName?.[0]}`}
                        </div>
                        <div className={`max-w-[75%] group`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isAdmin ? "bg-[#00C853] text-white rounded-tr-sm" : "bg-slate-100 text-[#0A1628] rounded-tl-sm"}`}
                          >
                            {msg.body}
                          </div>
                          <div
                            className={`flex items-center gap-2 mt-1 ${isAdmin ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <p className="text-xs text-slate-400">
                              {fmt(msg.createdAt)}
                            </p>
                            <button
                              onClick={() => handleDeleteMsg(msg._id)}
                              className="text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply box */}
              <form
                onSubmit={handleReply}
                className="p-4 border-t border-slate-100 flex gap-3"
              >
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="bg-[#00C853] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#00a844] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? (
                    <svg
                      className="w-4 h-4 animate-spin"
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
                  ) : (
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardMetricsModal({ user, investments, onClose, onUpdated }) {
  const activeInvestments = investments.filter(
    (investment) => investment.status === "Active",
  );
  const [totalInvested, setTotalInvested] = useState(
    String(
      user.totalInvestedOverride ??
        activeInvestments.reduce(
          (sum, investment) => sum + investment.amountInvested,
          0,
        ),
    ),
  );
  const [totalReturns, setTotalReturns] = useState(
    String(
      user.totalReturnsOverride ??
        activeInvestments.reduce(
          (sum, investment) => sum + investment.returnsEarned,
          0,
        ),
    ),
  );
  const [activePlans, setActivePlans] = useState(
    String(user.activePlansOverride ?? activeInvestments.length),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.updateDashboardMetrics(user._id, {
        totalInvestedOverride: Number(totalInvested),
        totalReturnsOverride: Number(totalReturns),
        activePlansOverride: Number(activePlans),
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-bold text-[#0A1628]">Edit Dashboard Metrics</h2>
          <p className="mt-1 text-xs text-slate-500">
            {user.firstName} {user.lastName} · Changes appear on their dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {[
            {
              label: "Total Invested ($)",
              value: totalInvested,
              setValue: setTotalInvested,
              step: "0.01",
            },
            {
              label: "Returns / Net Gain ($)",
              value: totalReturns,
              setValue: setTotalReturns,
              step: "0.01",
            },
            {
              label: "Active Plans",
              value: activePlans,
              setValue: setActivePlans,
              step: "1",
            },
          ].map((field) => (
            <label
              key={field.label}
              className="block text-sm font-medium text-slate-700"
            >
              {field.label}
              <input
                type="number"
                min="0"
                step={field.step}
                required
                value={field.value}
                onChange={(event) => field.setValue(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20"
              />
            </label>
          ))}
          <p className="text-xs text-slate-500">
            Returns and Net Gain use the same dashboard value. These display
            overrides do not create investment plans or transactions.
          </p>
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#00C853] py-2.5 text-sm font-semibold text-white hover:bg-[#00a844] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Dashboard Metrics"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Returns Modal ───────────────────────────────────────────────────────
function EditReturnsModal({ user, investments, onClose, onUpdated }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentReturns =
    investments?.reduce((s, i) => s + (i.returnsEarned || 0), 0) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.updateReturns(user._id, {
        returnsEarned: parseFloat(amount),
        note,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-[#0A1628]">Edit Total Returns</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.firstName} {user.lastName} · Current:{" "}
              <span className="font-semibold text-[#00C853]">
                ${currentReturns.toLocaleString()}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              New Total Returns (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={currentReturns.toFixed(2)}
                className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              This will be distributed across all active investment plans
              proportionally and credited to wallet.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Note (shown in user&apos;s transaction history)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Bonus, Correction..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !amount}
              className="flex-1 bg-[#00C853] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00a844] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Saving…
                </>
              ) : (
                "Update Returns"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Plan Modal ──────────────────────────────────────────────────────────
function EditPlanModal({ investment, onClose, onUpdated }) {
  const [form, setForm] = useState({
    planName: investment.planName || "Growth",
    amountInvested: investment.amountInvested || "",
    roiRate: investment.roiRate || "",
    returnsEarned: investment.returnsEarned || "",
    progressPct: investment.progressPct || "",
    status: investment.status || "Active",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.updateInvestment(investment._id, {
        planName: form.planName,
        amountInvested: Number(form.amountInvested),
        roiRate: Number(form.roiRate),
        returnsEarned: Number(form.returnsEarned),
        totalValue: Number(form.amountInvested) + Number(form.returnsEarned),
        progressPct: Number(form.progressPct),
        status: form.status,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inp =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-[#0A1628]">Edit Investment Plan</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Plan Type
              </label>
              <select
                value={form.planName}
                onChange={(e) => set("planName", e.target.value)}
                className={inp}
              >
                <option>Starter</option>
                <option>Growth</option>
                <option>Premium</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className={inp}
              >
                <option>Active</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Amount Invested ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amountInvested}
                onChange={(e) => set("amountInvested", e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Returns Earned ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.returnsEarned}
                onChange={(e) => set("returnsEarned", e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                ROI Rate (%)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.roiRate}
                onChange={(e) => set("roiRate", e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.progressPct}
                onChange={(e) => set("progressPct", e.target.value)}
                className={inp}
              />
            </div>
          </div>
          {form.amountInvested && form.returnsEarned && (
            <div className="bg-[#E8FFF1] rounded-xl p-3 text-sm">
              <span className="text-slate-500">Total Value: </span>
              <span className="font-bold text-[#00C853]">
                $
                {(
                  Number(form.amountInvested) + Number(form.returnsEarned)
                ).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#00C853] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00a844] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Portfolio Growth Modal ──────────────────────────────────────────────
const GROWTH_YEARS = [
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

function EditPortfolioGrowthModal({ user, onClose, onUpdated }) {
  const defaultGrowth =
    user.portfolioGrowth?.length === 18
      ? user.portfolioGrowth
      : [
          12, 18, 25, 32, 40, 48, 55, 62, 68, 72, 76, 80, 84, 86, 88, 90, 93,
          100,
        ];

  const [bars, setBars] = useState(defaultGrowth.map(String));
  const [growthValue, setGrowthValue] = useState(
    String(user.portfolioGrowthValue ?? 0),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setBar = (i, v) => {
    const next = [...bars];
    next[i] = v;
    setBars(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.updatePortfolioGrowth(user._id, {
        portfolioGrowth: bars.map((v) =>
          Math.min(100, Math.max(0, Number(v) || 0)),
        ),
        portfolioGrowthValue: Number(growthValue),
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-[#0A1628]">
              Edit Portfolio Growth Chart
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.firstName} {user.lastName} · Set bar heights 0–100 for each
              year (2009–2026)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <label className="block text-xs font-medium text-slate-600 mb-4">
            Portfolio Growth Amount ($)
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={growthValue}
              onChange={(e) => setGrowthValue(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
          </label>

          {/* Live preview */}
          <div className="bg-[#0A1628] rounded-xl p-4 mb-5">
            <p className="text-slate-400 text-xs mb-3">Preview</p>
            <div className="flex items-end gap-1 h-16">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-0.5"
                >
                  <div
                    className={`w-full rounded-t-sm transition-all ${i === bars.length - 1 ? "bg-[#00C853]" : "bg-[#00C853]/40"}`}
                    style={{
                      height: `${Math.min(100, Math.max(0, Number(h) || 0))}%`,
                    }}
                  />
                  <span className="text-[7px] text-slate-500">
                    {GROWTH_YEARS[i]?.slice(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of inputs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {GROWTH_YEARS.map((yr, i) => (
              <div key={yr}>
                <label className="text-xs text-slate-500 block mb-1 text-center">
                  {yr}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={bars[i]}
                  onChange={(e) => setBar(i, e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#00C853] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00a844] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Saving…
                </>
              ) : (
                "Save Chart"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Pending Investment Modal ────────────────────────────────────────────
function EditPendingInvestmentModal({ user, onClose, onUpdated }) {
  const [amount, setAmount] = useState(
    user.pendingInvestment?.toString() || "0",
  );
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.updatePendingInvestment(user._id, {
        pendingInvestment: parseFloat(amount) || 0,
        note,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-[#0A1628]">
              Edit Pending Investment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.firstName} {user.lastName} · Current:{" "}
              <span className="font-semibold text-amber-500">
                ${(user.pendingInvestment || 0).toLocaleString()}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Pending Investment Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Set to 0 to hide from the user&apos;s dashboard.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Note (sent as notification)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Investment awaiting confirmation..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-amber-500 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Saving…
                </>
              ) : (
                "Update Pending"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Overview", icon: "📊", id: "overview" },
  { label: "Users", icon: "👥", id: "users" },
  { label: "Investments", icon: "📈", id: "investments" },
  { label: "Withdrawals", icon: "🏦", id: "withdrawals" },
  { label: "Messages", icon: "💬", id: "messages" },
];

// ─── Add User Modal ───────────────────────────────────────────────────────────
function AddUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "United States",
    password: "User@123456",
    walletBalance: "0",
    kyc: "Pending",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.createUser({
        ...form,
        walletBalance: Number(form.walletBalance),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inp =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-[#0A1628]">Add New User</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                First Name
              </label>
              <input
                required
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="John"
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Last Name
              </label>
              <input
                required
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Doe"
                className={inp}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="john@email.com"
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (212) 555-0000"
              className={inp}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Country
              </label>
              <select
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                className={inp}
              >
                {[
                  "United States",
                  "Canada",
                  "United Kingdom",
                  "Australia",
                  "Germany",
                  "France",
                  "Netherlands",
                  "Other",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                KYC Status
              </label>
              <select
                value={form.kyc}
                onChange={(e) => set("kyc", e.target.value)}
                className={inp}
              >
                <option>Pending</option>
                <option>Verified</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Initial Password
              </label>
              <input
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="User@123456"
                className={inp}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Wallet Balance ($)
              </label>
              <input
                type="number"
                min="0"
                value={form.walletBalance}
                onChange={(e) => set("walletBalance", e.target.value)}
                placeholder="0"
                className={inp}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#00C853] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00a844] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Creating…
                </>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit Balance Modal ───────────────────────────────────────────────────────
function EditBalanceModal({ user, onClose, onUpdated }) {
  const [amount, setAmount] = useState(user.walletBalance?.toString() || "0");
  const [operation, setOperation] = useState("set");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const preview = (() => {
    const n = parseFloat(amount) || 0;
    if (operation === "add") return user.walletBalance + n;
    if (operation === "subtract") return Math.max(0, user.walletBalance - n);
    return n;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminAPI.updateBalance(user._id, {
        walletBalance: parseFloat(amount),
        operation,
        note,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-[#0A1628]">Edit Balance</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {user.firstName} {user.lastName} · Current:{" "}
              <span className="font-semibold text-[#00C853]">
                ${(user.walletBalance || 0).toLocaleString()}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-5 h-5"
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
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Operation selector */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-2">
              Operation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "set", l: "Set to", icon: "=" },
                { v: "add", l: "Add", icon: "+" },
                { v: "subtract", l: "Subtract", icon: "−" },
              ].map((op) => (
                <button
                  key={op.v}
                  type="button"
                  onClick={() => setOperation(op.v)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition-all ${operation === op.v ? "border-[#00C853] bg-[#E8FFF1] text-[#00C853]" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                >
                  <span className="text-base">{op.icon}</span> {op.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Amount ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">New balance will be:</span>
            <span className="text-lg font-bold text-[#00C853]">
              $
              {preview.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Note (shown in user&apos;s transaction history)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Bonus credit, Correction, etc."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#00C853] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00a844] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Saving…
                </>
              ) : (
                "Update Balance"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ user, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminAPI.deleteUser(user._id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h2 className="font-bold text-[#0A1628] text-lg">Delete User</h2>
          <p className="text-slate-500 text-sm mt-1">
            This will permanently delete{" "}
            <span className="font-semibold text-[#0A1628]">
              {user.firstName} {user.lastName}
            </span>{" "}
            and all their investments, transactions, and notifications.
          </p>
        </div>
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
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
                Deleting…
              </>
            ) : (
              "Delete Permanently"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dashboardMetricsUser, setDashboardMetricsUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [balanceUser, setBalanceUser] = useState(null);
  const [deleteUser, setDeleteUserModal] = useState(null);
  const [returnsUser, setReturnsUser] = useState(null);
  const [editPlanInv, setEditPlanInv] = useState(null);
  const [growthUser, setGrowthUser] = useState(null); // for portfolio growth modal
  const [pendingUser, setPendingUser] = useState(null); // for pending investment modal

  // ── Overview state ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  // ── Users state ─────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [kycFilter, setKycFilter] = useState("All");
  const [userPage, setUserPage] = useState(1);

  // ── Investments state ────────────────────────────────────────────────────────
  const [investments, setInvestments] = useState([]);
  const [invTotal, setInvTotal] = useState(0);
  const [invLoading, setInvLoading] = useState(false);
  const [invStatusFilter, setInvStatusFilter] = useState("All");
  const [invPage, setInvPage] = useState(1);

  // ── Withdrawals state ────────────────────────────────────────────────────────
  const [withdrawals, setWithdrawals] = useState([]);
  const [wdTotal, setWdTotal] = useState(0);
  const [wdLoading, setWdLoading] = useState(false);
  const [wdStatusFilter, setWdStatusFilter] = useState("All");
  const [savingWd, setSavingWd] = useState(null);

  // ── Fetch helpers ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    try {
      const [s, u] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers({ limit: 5, page: 1 }),
      ]);
      setStats(s.stats);
      setRecentUsers(u.users);
    } catch (e) {
      setStatsError(e.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const q = { page: userPage, limit: 15 };
      if (search) q.search = search;
      if (statusFilter !== "All") q.status = statusFilter;
      if (kycFilter !== "All") q.kyc = kycFilter;
      const res = await adminAPI.getAllUsers(q);
      setUsers(res.users);
      setUserTotal(res.total);
    } catch (_) {
    } finally {
      setUsersLoading(false);
    }
  }, [search, statusFilter, kycFilter, userPage]);

  const fetchInvestments = useCallback(async () => {
    setInvLoading(true);
    try {
      const q = { page: invPage, limit: 15 };
      if (invStatusFilter !== "All") q.status = invStatusFilter;
      const res = await adminAPI.getInvestments(q);
      setInvestments(res.investments);
      setInvTotal(res.total);
    } catch (_) {
    } finally {
      setInvLoading(false);
    }
  }, [invStatusFilter, invPage]);

  const fetchWithdrawals = useCallback(async () => {
    setWdLoading(true);
    try {
      const q = {};
      if (wdStatusFilter !== "All") q.status = wdStatusFilter;
      const res = await adminAPI.getWithdrawals(q);
      setWithdrawals(res.withdrawals);
      setWdTotal(res.total);
    } catch (_) {
    } finally {
      setWdLoading(false);
    }
  }, [wdStatusFilter]);

  // ── Trigger fetches on tab change ────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "overview") fetchStats();
  }, [activeTab, fetchStats]);
  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab, fetchUsers]);
  useEffect(() => {
    if (activeTab === "investments") fetchInvestments();
  }, [activeTab, fetchInvestments]);
  useEffect(() => {
    if (activeTab === "withdrawals") fetchWithdrawals();
  }, [activeTab, fetchWithdrawals]);

  // Re-fetch users when search / filters change (with small debounce)
  useEffect(() => {
    if (activeTab !== "users") return;
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter, kycFilter, userPage, activeTab, fetchUsers]);

  const handleWithdrawalUpdate = async (id, status) => {
    setSavingWd(id);
    try {
      await adminAPI.updateWithdrawal(id, { status });
      fetchWithdrawals();
      fetchStats();
    } catch (_) {
    } finally {
      setSavingWd(null);
    }
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Logo light />
        <div className="mt-2 inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          Admin Panel
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${activeTab === item.id ? "bg-[#00C853] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center">
            A
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Admin</p>
            <p className="text-slate-400 text-xs">admin@apexvestinc.com</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="flex-1 text-center text-xs text-slate-400 hover:text-white transition-colors py-1"
          >
            ← Site
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0A1628] fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0A1628] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo light />
          <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white"
        >
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
        </button>
      </div>
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 h-full w-60 bg-[#0A1628] z-50 overflow-y-auto">
            <Sidebar />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:pl-60 flex-1 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ── OVERVIEW ──────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0A1628]">
                  Admin Overview
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Live platform metrics
                </p>
              </div>

              {statsLoading && (
                <div className="flex items-center justify-center py-20 text-slate-400">
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
                  Loading stats…
                </div>
              )}
              {statsError && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                  {statsError}
                </p>
              )}

              {stats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                      label="Total Users"
                      value={stats.totalUsers}
                      sub={`${stats.activeUsers} active`}
                      icon="👥"
                      highlight
                    />
                    <StatCard
                      label="Assets Under Mgmt"
                      value={`$${(stats.totalAUM / 1000).toFixed(0)}K`}
                      sub="Total invested"
                      icon="💰"
                    />
                    <StatCard
                      label="Returns Paid"
                      value={`$${(stats.totalReturnsPaid / 1000).toFixed(0)}K`}
                      sub="All time"
                      icon="📈"
                    />
                    <StatCard
                      label="KYC Verified"
                      value={`${stats.totalUsers - stats.pendingKyc}/${stats.totalUsers}`}
                      sub={`${stats.pendingKyc} pending`}
                      icon="✅"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        label: "Active Plans",
                        val: stats.activeInvestments,
                        color: "text-[#00C853]",
                      },
                      {
                        label: "Pending Withdrawals",
                        val: stats.pendingWithdrawals,
                        color: "text-amber-500",
                      },
                      {
                        label: "Suspended Accounts",
                        val: stats.suspendedUsers,
                        color: "text-red-500",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between"
                      >
                        <p className="text-slate-500 text-sm">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color}`}>
                          {s.val}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <h2 className="font-bold text-[#0A1628]">
                        Recent Signups
                      </h2>
                      <button
                        onClick={() => setActiveTab("users")}
                        className="text-xs text-[#00C853] font-semibold hover:underline"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {recentUsers.map((u) => (
                        <div
                          key={u._id}
                          className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedUserId(u._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {u.firstName?.[0]}
                              {u.lastName?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-[#0A1628] text-sm">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${kycColor[u.kyc?.status]}`}
                            >
                              {u.kyc?.status}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {!recentUsers.length && (
                        <p className="text-center py-8 text-slate-400 text-sm">
                          No users yet
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── USERS ─────────────────────────────────────────────── */}
          {activeTab === "users" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#0A1628]">
                    User Management
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {userTotal} total users
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="inline-flex items-center gap-2 bg-[#00C853] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#00a844] transition-colors"
                  >
                    + Add User
                  </button>
                  <button
                    onClick={fetchUsers}
                    className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl hover:border-[#00C853] hover:text-[#00C853] transition-colors"
                  >
                    ↻ Refresh
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
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
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setUserPage(1);
                    }}
                    placeholder="Search name, email…"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00C853]/30"
                >
                  <option value="All">All Statuses</option>
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Inactive</option>
                </select>
                <select
                  value={kycFilter}
                  onChange={(e) => {
                    setKycFilter(e.target.value);
                    setUserPage(1);
                  }}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00C853]/30"
                >
                  <option value="All">All KYC</option>
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="hidden lg:grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Contact</div>
                  <div className="col-span-1">KYC</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Wallet</div>
                  <div className="col-span-2">Action</div>
                </div>

                {usersLoading ? (
                  <div className="py-16 text-center text-slate-400">
                    <svg
                      className="w-8 h-8 animate-spin text-[#00C853] mx-auto mb-2"
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
                    Loading users…
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {users.length === 0 ? (
                      <div className="py-16 text-center text-slate-400">
                        <p className="text-3xl mb-2">🔍</p>
                        <p className="font-medium">No users found</p>
                      </div>
                    ) : (
                      users.map((u) => (
                        <div
                          key={u._id}
                          className="px-5 py-4 hover:bg-slate-50 transition-colors"
                        >
                          {/* Mobile */}
                          <div className="flex items-center justify-between lg:hidden gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {u.firstName?.[0]}
                                {u.lastName?.[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-[#0A1628] text-sm">
                                  {u.firstName} {u.lastName}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {u.email}
                                </p>
                                <div className="flex gap-1.5 mt-1">
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[u.status]}`}
                                  >
                                    {u.status}
                                  </span>
                                  <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kycColor[u.kyc?.status]}`}
                                  >
                                    {u.kyc?.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedUserId(u._id)}
                              className="shrink-0 rounded-lg border border-[#00C853] px-3 py-2 text-xs font-semibold text-[#008a3a] transition-colors hover:bg-[#E8FFF1]"
                            >
                              Manage user
                            </button>
                          </div>
                          {/* Desktop */}
                          <div className="hidden lg:grid grid-cols-12 gap-2 items-center text-sm">
                            <div className="col-span-3 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {u.firstName?.[0]}
                                {u.lastName?.[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-[#0A1628] text-sm">
                                  {u.firstName} {u.lastName}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {new Date(u.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-slate-600 truncate">
                                {u.email}
                              </p>
                              <p className="text-xs text-slate-400">
                                {u.phone || "—"}
                              </p>
                            </div>
                            <div className="col-span-1">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kycColor[u.kyc?.status]}`}
                              >
                                {u.kyc?.status}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[u.status]}`}
                              >
                                {u.status}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <p className="font-semibold text-[#0A1628] text-sm">
                                ${fmt(u.walletBalance)}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <button
                                onClick={() => setSelectedUserId(u._id)}
                                className="w-full rounded-lg border border-[#00C853] px-2 py-2 text-xs font-semibold text-[#008a3a] transition-colors hover:bg-[#E8FFF1]"
                              >
                                Manage user
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-400">
                    Showing {users.length} of {userTotal}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage === 1}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-[#00C853] disabled:opacity-40 transition-colors"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs px-3 py-1.5 text-slate-500">
                      Page {userPage}
                    </span>
                    <button
                      onClick={() => setUserPage((p) => p + 1)}
                      disabled={users.length < 15}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-[#00C853] disabled:opacity-40 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── INVESTMENTS ───────────────────────────────────────── */}
          {activeTab === "investments" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#0A1628]">
                    All Investments
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {invTotal} total
                  </p>
                </div>
                <select
                  value={invStatusFilter}
                  onChange={(e) => {
                    setInvStatusFilter(e.target.value);
                    setInvPage(1);
                  }}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="hidden lg:grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Plan</div>
                  <div className="col-span-2">Invested</div>
                  <div className="col-span-2">Returns</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Progress</div>
                </div>
                {invLoading ? (
                  <div className="py-16 text-center text-slate-400">
                    Loading…
                  </div>
                ) : investments.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <p className="text-3xl mb-2">📊</p>
                    <p>No investments yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {investments.map((inv) => (
                      <div
                        key={inv._id}
                        className="px-5 py-4 hover:bg-slate-50"
                      >
                        <div className="hidden lg:grid grid-cols-12 gap-2 items-center text-sm">
                          <div className="col-span-3">
                            <p className="font-medium text-[#0A1628]">
                              {inv.user?.firstName} {inv.user?.lastName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {inv.user?.email}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tierColor[inv.planName]}`}
                            >
                              {inv.planName}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <p className="font-semibold text-[#0A1628]">
                              ${fmt(inv.amountInvested)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-semibold text-[#00C853]">
                              +${fmt(inv.returnsEarned)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inv.status === "Active" ? "bg-[#E8FFF1] text-[#00C853]" : "bg-slate-100 text-slate-500"}`}
                            >
                              {inv.status}
                            </span>
                          </div>
                          <div className="col-span-1">
                            <div className="h-1.5 bg-slate-100 rounded-full">
                              <div
                                className="h-full bg-[#00C853] rounded-full"
                                style={{ width: `${inv.progressPct || 0}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {inv.progressPct || 0}%
                            </p>
                            <button
                              onClick={() => setEditPlanInv(inv)}
                              className="mt-1.5 text-xs text-[#00C853] font-semibold border border-[#00C853] px-2 py-1 rounded-lg hover:bg-[#E8FFF1] transition-colors"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        </div>
                        {/* Mobile */}
                        <div className="lg:hidden flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#0A1628] text-sm">
                              {inv.user?.firstName} {inv.user?.lastName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {inv.planName} · ${fmt(inv.amountInvested)}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inv.status === "Active" ? "bg-[#E8FFF1] text-[#00C853]" : "bg-slate-100 text-slate-500"}`}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-400">
                    Showing {investments.length} of {invTotal}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInvPage((p) => Math.max(1, p - 1))}
                      disabled={invPage === 1}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setInvPage((p) => p + 1)}
                      disabled={investments.length < 15}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── WITHDRAWALS ───────────────────────────────────────── */}
          {activeTab === "withdrawals" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#0A1628]">
                    Withdrawals
                  </h1>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {wdTotal} total
                  </p>
                </div>
                <select
                  value={wdStatusFilter}
                  onChange={(e) => setWdStatusFilter(e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Completed</option>
                  <option>Failed</option>
                </select>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="hidden lg:grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-3">User</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-3">Bank</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                {wdLoading ? (
                  <div className="py-16 text-center text-slate-400">
                    Loading…
                  </div>
                ) : withdrawals.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <p className="text-3xl mb-2">🏦</p>
                    <p>No withdrawals</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {withdrawals.map((w) => (
                      <div key={w._id} className="px-5 py-4 hover:bg-slate-50">
                        <div className="hidden lg:grid grid-cols-12 gap-2 items-center text-sm">
                          <div className="col-span-3">
                            <p className="font-medium text-[#0A1628]">
                              {w.user?.firstName} {w.user?.lastName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {w.user?.email}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-bold text-red-500">
                              -${fmt(w.amount)}
                            </p>
                          </div>
                          <div className="col-span-3">
                            <p className="text-xs text-slate-600">
                              {w.bankName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {w.accountNumber?.slice(-4).padStart(8, "•")}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                w.status === "Completed"
                                  ? "bg-[#E8FFF1] text-[#00C853]"
                                  : w.status === "Pending"
                                    ? "bg-amber-50 text-amber-600"
                                    : w.status === "Failed"
                                      ? "bg-red-50 text-red-500"
                                      : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>
                          <div className="col-span-2 flex gap-1.5">
                            {w.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleWithdrawalUpdate(w._id, "Completed")
                                  }
                                  disabled={savingWd === w._id}
                                  className="text-xs bg-[#E8FFF1] text-[#00C853] px-2.5 py-1.5 rounded-lg font-semibold hover:bg-[#00C853] hover:text-white transition-colors disabled:opacity-50"
                                >
                                  {savingWd === w._id ? "…" : "Approve"}
                                </button>
                                <button
                                  onClick={() =>
                                    handleWithdrawalUpdate(w._id, "Failed")
                                  }
                                  disabled={savingWd === w._id}
                                  className="text-xs bg-red-50 text-red-500 px-2.5 py-1.5 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {w.status !== "Pending" && (
                              <span className="text-xs text-slate-400 italic">
                                No actions
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Mobile */}
                        <div className="lg:hidden flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-[#0A1628] text-sm">
                              {w.user?.firstName} {w.user?.lastName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {w.bankName} · ${fmt(w.amount)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${w.status === "Completed" ? "bg-[#E8FFF1] text-[#00C853]" : w.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}
                            >
                              {w.status}
                            </span>
                            {w.status === "Pending" && (
                              <button
                                onClick={() =>
                                  handleWithdrawalUpdate(w._id, "Completed")
                                }
                                className="text-xs bg-[#00C853] text-white px-2 py-1 rounded-lg"
                              >
                                ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MESSAGES ──────────────────────────────────────────── */}
          {activeTab === "messages" && <MessagesTab />}
        </div>
      </main>

      {/* User detail modal */}
      {selectedUserId && (
        <UserModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onEditMetrics={(user, investments) => {
            setSelectedUserId(null);
            setDashboardMetricsUser({ user, investments });
          }}
          onEditBalance={(user) => {
            setSelectedUserId(null);
            setBalanceUser(user);
          }}
          onEditGrowth={(user) => {
            setSelectedUserId(null);
            setGrowthUser(user);
          }}
          onEditPending={(user) => {
            setSelectedUserId(null);
            setPendingUser(user);
          }}
          onUpdate={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}

      {dashboardMetricsUser && (
        <DashboardMetricsModal
          user={dashboardMetricsUser.user}
          investments={dashboardMetricsUser.investments}
          onClose={() => setDashboardMetricsUser(null)}
          onUpdated={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}

      {/* Add User modal */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onCreated={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}

      {/* Edit Balance modal */}
      {balanceUser && (
        <EditBalanceModal
          user={balanceUser}
          onClose={() => setBalanceUser(null)}
          onUpdated={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}

      {/* Delete Confirm modal */}
      {deleteUser && (
        <DeleteConfirmModal
          user={deleteUser}
          onClose={() => setDeleteUserModal(null)}
          onDeleted={() => {
            fetchUsers();
            fetchStats();
          }}
        />
      )}

      {/* Edit Returns modal */}
      {returnsUser && (
        <EditReturnsModal
          user={returnsUser.user}
          investments={returnsUser.investments}
          onClose={() => setReturnsUser(null)}
          onUpdated={() => {
            fetchUsers();
            fetchStats();
            fetchInvestments();
          }}
        />
      )}

      {/* Edit Plan modal */}
      {editPlanInv && (
        <EditPlanModal
          investment={editPlanInv}
          onClose={() => setEditPlanInv(null)}
          onUpdated={() => {
            fetchInvestments();
            fetchStats();
          }}
        />
      )}

      {/* Edit Portfolio Growth modal */}
      {growthUser && (
        <EditPortfolioGrowthModal
          user={growthUser}
          onClose={() => setGrowthUser(null)}
          onUpdated={() => {
            fetchUsers();
          }}
        />
      )}

      {/* Edit Pending Investment modal */}
      {pendingUser && (
        <EditPendingInvestmentModal
          user={pendingUser}
          onClose={() => setPendingUser(null)}
          onUpdated={() => {
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
