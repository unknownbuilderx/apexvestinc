"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("request"); // request | sent | reset | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          {/* Step 1: Enter email */}
          {step === "request" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#E8FFF1] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#0A1628]">Forgot your password?</h1>
                <p className="text-slate-500 text-sm mt-2">No worries. Enter your email and we&apos;ll send a reset code.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setStep("sent"); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@email.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                  />
                </div>
                <button type="submit" className="w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm">
                  Send Reset Code
                </button>
              </form>
            </>
          )}

          {/* Step 2: Check email */}
          {step === "sent" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8FFF1] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm mb-2">We sent a 6-digit code to</p>
              <p className="text-[#0A1628] font-semibold text-sm mb-8">{email}</p>

              {/* OTP input */}
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 text-center border border-slate-200 rounded-xl text-lg font-bold text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                  />
                ))}
              </div>

              <button
                onClick={() => setStep("reset")}
                className="w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm mb-4"
              >
                Verify Code
              </button>
              <p className="text-slate-500 text-xs">
                Didn&apos;t receive it?{" "}
                <button className="text-[#00C853] font-medium hover:underline">Resend in 0:45</button>
              </p>
            </div>
          )}

          {/* Step 3: New password */}
          {step === "reset" && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#E8FFF1] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#0A1628]">Set new password</h2>
                <p className="text-slate-500 text-sm mt-2">Must be at least 8 characters with a number and symbol.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setStep("done"); }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"} required minLength={8}
                      value={passwords.password}
                      onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                      placeholder="Create a strong password"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password" required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repeat your password"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853] ${
                      passwords.confirm && passwords.confirm !== passwords.password ? "border-red-300" : "border-slate-200"
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwords.password !== passwords.confirm || passwords.password.length < 8}
                  className="w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm disabled:opacity-50"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-[#E8FFF1] rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#0A1628] mb-2">Password Reset!</h2>
              <p className="text-slate-500 text-sm mb-8">Your password has been successfully updated. You can now log in.</p>
              <Link href="/login" className="block w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm text-center">
                Back to Login
              </Link>
            </div>
          )}

        </div>

        {step !== "done" && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Remembered it?{" "}
            <Link href="/login" className="text-[#00C853] font-semibold hover:underline">Back to login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
