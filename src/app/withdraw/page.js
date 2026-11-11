"use client";
import { useState } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

const BTC_ADDRESS = "bc1qh4wa4lg85fdvfww6505dqz8y0gtd9xe7yzwrgs";

const plans = [
  { id: "growth-1", name: "Growth Plan", available: 4820.0 },
  { id: "premium-1", name: "Premium Plan", available: 3600.0 },
  { id: "starter-1", name: "Starter Plan", available: 180.0 },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
        copied
          ? "bg-[#00C853] text-white"
          : "bg-slate-100 text-slate-600 hover:bg-[#E8FFF1] hover:text-[#00C853]"
      }`}
    >
      {copied ? (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function WithdrawPage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(plans[0].id);
  const [amount, setAmount] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [note, setNote] = useState("");

  const plan = plans.find((p) => p.id === selectedPlan);
  const amountNum = parseFloat(amount) || 0;
  const isValid =
    amountNum >= 50 &&
    amountNum <= plan.available &&
    btcAddress.trim().length >= 26;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628]">
          Withdraw Investment
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Withdraw your returns via Bitcoin (BTC)
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8 max-w-md">
        {["Details", "Confirm", "Done"].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1
                    ? "bg-[#00C853] text-white"
                    : step === i + 1
                      ? "bg-[#0A1628] text-white"
                      : "bg-slate-200 text-slate-400"
                }`}
              >
                {step > i + 1 ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-sm font-medium ${step === i + 1 ? "text-[#0A1628]" : "text-slate-400"}`}
              >
                {s}
              </span>
            </div>
            {i < 2 && <div className="w-8 h-px bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* ── STEP 1: Form ─────────────────────────────────────────── */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6"
            >
              {/* Plan selector */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1628] mb-3">
                  Select Source Plan
                </label>
                <div className="space-y-2">
                  {plans.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === p.id
                          ? "border-[#00C853] bg-[#E8FFF1]"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          checked={selectedPlan === p.id}
                          onChange={() => setSelectedPlan(p.id)}
                          className="text-[#00C853] focus:ring-[#00C853]"
                        />
                        <span className="font-medium text-[#0A1628] text-sm">
                          {p.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Available</p>
                        <p className="font-bold text-[#00C853]">
                          ${p.available.toLocaleString()}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-[#0A1628]">
                    Withdrawal Amount (USD)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(plan.available.toString())}
                    className="text-xs text-[#00C853] font-medium hover:underline"
                  >
                    Withdraw all
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min={50}
                    max={plan.available}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                  />
                </div>
                {amount && amountNum < 50 && (
                  <p className="text-red-500 text-xs mt-1">
                    Minimum withdrawal is $50
                  </p>
                )}
                {amount && amountNum > plan.available && (
                  <p className="text-red-500 text-xs mt-1">
                    Maximum available is ${plan.available}
                  </p>
                )}
                {amount && amountNum >= 50 && amountNum <= plan.available && (
                  <p className="text-[#00C853] text-xs mt-1">
                    ✓ Amount is valid
                  </p>
                )}
              </div>

              {/* Bitcoin address input */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">
                  Your Bitcoin (BTC) Wallet Address
                </label>
                <input
                  type="text"
                  value={btcAddress}
                  onChange={(e) => setBtcAddress(e.target.value)}
                  placeholder="Enter your BTC wallet address"
                  required
                  minLength={26}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Make sure the address is correct. Crypto transfers are
                  irreversible.
                </p>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1628] mb-1.5">
                  Note (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g. Monthly payout"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                />
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm disabled:opacity-50"
              >
                Continue to Confirm
              </button>
            </form>
          )}

          {/* ── STEP 2: Confirm ──────────────────────────────────────── */}
          {step === 2 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0A1628] mb-5">
                Confirm Withdrawal
              </h2>
              <div className="bg-slate-50 rounded-xl divide-y divide-slate-200 mb-6">
                {[
                  { label: "Source Plan", val: plan.name },
                  {
                    label: "Withdrawal Amount",
                    val: `$${amountNum.toFixed(2)}`,
                  },
                  { label: "Processing Fee", val: "Free" },
                  {
                    label: "You will receive",
                    val: `$${amountNum.toFixed(2)}`,
                    highlight: true,
                  },
                  { label: "Method", val: "Bitcoin (BTC)" },
                  {
                    label: "BTC Address",
                    val: btcAddress.slice(0, 12) + "…" + btcAddress.slice(-6),
                  },
                  { label: "Processing Time", val: "Within 24 hours" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span
                      className={`text-sm font-semibold ${r.highlight ? "text-[#00C853] text-base" : "text-[#0A1628]"}`}
                    >
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex gap-2">
                <svg
                  className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Crypto withdrawals are irreversible. Double-check your BTC
                  address before confirming.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Success ──────────────────────────────────────── */}
          {step === 3 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 bg-[#E8FFF1] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-10 h-10 text-[#00C853]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-2">
                Withdrawal Submitted!
              </h2>
              <p className="text-slate-500 text-sm mb-1">
                Your withdrawal of{" "}
                <span className="font-bold text-[#00C853]">
                  ${amountNum.toFixed(2)}
                </span>{" "}
                has been submitted.
              </p>
              <p className="text-slate-400 text-xs mb-6">
                BTC will be sent to your wallet within 24 hours.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-left mb-6 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference</span>
                  <span className="font-mono font-semibold text-[#0A1628]">
                    WD-{Date.now().toString().slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="text-amber-600 font-semibold">
                    Processing
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">BTC Address</span>
                  <span className="font-mono text-xs text-[#0A1628]">
                    {btcAddress.slice(0, 10)}…{btcAddress.slice(-6)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/withdrawal-history"
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors text-center"
                >
                  View History
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 bg-[#00C853] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#00a844] transition-colors text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* BTC Payment card with QR */}
          <div className="bg-[#0A1628] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              {/* Bitcoin icon */}
              <div className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-black">₿</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Bitcoin (BTC)</p>
                <p className="text-slate-400 text-xs">Withdrawal Address</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-3 mb-4 flex items-center justify-center">
              <Image
                src="/qrcode.JPG"
                alt="Bitcoin QR Code"
                width={180}
                height={180}
                className="rounded-lg"
                unoptimized
              />
            </div>

            {/* Address */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-2">
                Scan QR or copy address:
              </p>
              <p className="text-white text-xs font-mono break-all leading-relaxed mb-3">
                {BTC_ADDRESS}
              </p>
              <CopyButton text={BTC_ADDRESS} />
            </div>

            <p className="text-slate-500 text-xs mt-3 leading-relaxed">
              ⚠️ Only send BTC to this address. Sending any other cryptocurrency
              will result in permanent loss.
            </p>
          </div>

          {/* Wallet summary */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0A1628] mb-4 text-sm">
              Wallet Summary
            </h3>
            <div className="space-y-3">
              {plans.map((p) => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-slate-500">{p.name}</span>
                  <span className="font-semibold text-[#00C853]">
                    ${p.available.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold">
                <span className="text-[#0A1628]">Total Available</span>
                <span className="text-[#00C853]">
                  ${plans.reduce((s, p) => s + p.available, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm space-y-3">
            <h3 className="font-bold text-[#0A1628] text-sm">
              Withdrawal Info
            </h3>
            {[
              { icon: "⚡", text: "Minimum withdrawal: $50" },
              { icon: "₿", text: "Paid out in Bitcoin (BTC)" },
              { icon: "⏱", text: "Processed within 24 hours" },
              { icon: "💸", text: "Zero withdrawal fees" },
              { icon: "🔒", text: "Secure crypto transfer" },
            ].map((i) => (
              <div
                key={i.text}
                className="flex items-center gap-2 text-slate-600"
              >
                <span>{i.icon}</span>
                <span className="text-xs">{i.text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/withdrawal-history"
            className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-[#00C853] transition-colors group"
          >
            <div>
              <p className="font-semibold text-[#0A1628] text-sm">
                Withdrawal History
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                View all past withdrawals
              </p>
            </div>
            <svg
              className="w-5 h-5 text-slate-300 group-hover:text-[#00C853] transition-colors"
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
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
