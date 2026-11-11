"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [txAlerts, setTxAlerts] = useState(true);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });

  const handlePwSave = (e) => {
    e.preventDefault();
    setPwSaved(true);
    setShowPwForm(false);
    setPw({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C853]/40 ${checked ? "bg-[#00C853]" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );

  const sessions = [
    {
      device: "MacBook Air (Chrome)",
      location: "New York, NY",
      time: "Active now",
      current: true,
    },
    {
      device: "iPhone 14 (Safari)",
      location: "New York, NY",
      time: "2 hours ago",
      current: false,
    },
    {
      device: "Windows PC (Firefox)",
      location: "Austin, TX",
      time: "3 days ago",
      current: false,
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628]">Security Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage your account security and login preferences
        </p>
      </div>

      {pwSaved && (
        <div className="mb-6 bg-[#E8FFF1] border border-[#00C853]/30 rounded-xl px-4 py-3 flex items-center gap-2 text-[#00C853] text-sm font-medium">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Password updated successfully!
        </div>
      )}

      {/* Security score */}
      <div className="bg-[#0A1628] rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Security Score</p>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-black text-white">82</p>
              <p className="text-slate-300 text-sm mb-1">
                /100 ·{" "}
                <span className="text-[#00C853] font-semibold">Good</span>
              </p>
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00C853] to-[#00a844] rounded-full"
                style={{ width: "82%" }}
              />
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Enable biometric login to reach 100
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Authentication */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-[#0A1628] mb-5">Authentication</h2>
          <div className="space-y-5">
            {/* 2FA */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8FFF1] flex items-center justify-center flex-shrink-0">
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
                      d="M12 18h.01M8 21h8a2 2 0 002-2v-1a7 7 0 00-14 0v1a2 2 0 002 2zM12 11a4 4 0 100-8 4 4 0 000 8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#0A1628] text-sm">
                    Two-Factor Authentication
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Require a code from your phone at login
                  </p>
                  {twoFA && (
                    <p className="text-[#00C853] text-xs mt-1 font-medium">
                      ✓ Active via SMS
                    </p>
                  )}
                </div>
              </div>
              <Toggle checked={twoFA} onChange={setTwoFA} />
            </div>

            <div className="h-px bg-slate-100" />

            {/* Biometric */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#0A1628] text-sm">
                    Biometric Login
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Use Face ID or fingerprint to sign in
                  </p>
                </div>
              </div>
              <Toggle checked={biometric} onChange={setBiometric} />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-[#0A1628] mb-5">
            Notification Preferences
          </h2>
          <div className="space-y-5">
            {[
              {
                label: "Login Alerts",
                desc: "Get notified of new logins to your account",
                state: loginAlerts,
                setter: setLoginAlerts,
                icon: "🔔",
              },
              {
                label: "Transaction Alerts",
                desc: "Notifications for deposits, withdrawals, returns",
                state: txAlerts,
                setter: setTxAlerts,
                icon: "💸",
              },
              {
                label: "Marketing Emails",
                desc: "New features, investment tips, and offers",
                state: false,
                setter: () => {},
                icon: "📧",
              },
              {
                label: "Monthly Reports",
                desc: "Monthly performance summary via email",
                state: true,
                setter: () => {},
                icon: "📊",
              },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-[#0A1628] text-sm">
                        {item.label}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Toggle checked={item.state} onChange={item.setter} />
                </div>
                {i < arr.length - 1 && (
                  <div className="h-px bg-slate-100 mt-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628]">Change Password</h2>
            {!showPwForm && (
              <button
                onClick={() => setShowPwForm(true)}
                className="text-sm text-[#00C853] font-semibold hover:underline"
              >
                Update
              </button>
            )}
          </div>
          {!showPwForm ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-lg bg-[#E8FFF1] flex items-center justify-center">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0A1628]">
                    Password last changed
                  </p>
                  <p className="text-xs text-slate-400">September 18, 2026</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
                We recommend changing your password every 90 days and never
                reusing old passwords.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePwSave} className="space-y-4">
              {[
                { label: "Current Password", key: "current" },
                { label: "New Password", key: "newPw" },
                { label: "Confirm New Password", key: "confirm" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={pw[f.key]}
                    onChange={(e) => setPw({ ...pw, [f.key]: e.target.value })}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPwForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00C853] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00a844]"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628]">Active Sessions</h2>
            <button className="text-xs text-red-500 font-semibold hover:underline">
              Revoke all others
            </button>
          </div>
          <div className="space-y-4">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.current ? "bg-[#E8FFF1]" : "bg-slate-100"}`}
                  >
                    <svg
                      className={`w-5 h-5 ${s.current ? "text-[#00C853]" : "text-slate-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A1628]">
                      {s.device}
                    </p>
                    <p className="text-xs text-slate-400">
                      {s.location} · {s.time}
                    </p>
                  </div>
                </div>
                {s.current ? (
                  <span className="text-xs bg-[#E8FFF1] text-[#00C853] font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0">
                    Current
                  </span>
                ) : (
                  <button className="text-xs text-red-400 hover:text-red-600 font-medium flex-shrink-0">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-red-600 mb-4">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-medium text-[#0A1628] text-sm">
              Deactivate Account
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Your account and investments will be frozen. You can reactivate at
              any time.
            </p>
          </div>
          <button className="flex-shrink-0 border border-red-300 text-red-500 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
            Deactivate
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
