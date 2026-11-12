"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const steps = ["Account", "Personal", "Security"];

export default function SignUpPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: "" });
  const [captchaError, setCaptchaError] = useState("");

  // Generate a fresh captcha when entering step 2
  const genCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, answer: "" });
    setCaptchaError("");
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdName, setCreatedName] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    dob: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: "" }));
  };

  // ── Step 0 validation ────────────────────────────────────────────────────────
  const validateStep0 = () => {
    const errors = {};
    if (!form.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Enter a valid email address";
    if (!form.phone) errors.phone = "Phone number is required";
    return errors;
  };

  // ── Step 1 validation ────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.country) errors.country = "Please select your country";
    if (!form.dob) errors.dob = "Date of birth is required";
    return errors;
  };

  // ── Next step ────────────────────────────────────────────────────────────────
  const handleNext = (e) => {
    e.preventDefault();
    const errors = step === 0 ? validateStep0() : validateStep1();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    if (step === 1) genCaptcha(); // generate captcha when entering step 2
    setStep((s) => s + 1);
  };

  // ── Final submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    const errors = {};
    if (!form.password) errors.password = "Password is required";
    else if (form.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (!form.confirm) errors.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      errors.confirm = "Passwords do not match";
    if (!form.agree) errors.agree = "You must agree to the terms";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    // Validate captcha
    if (Number(captcha.answer) !== captcha.a + captcha.b) {
      setCaptchaError("Incorrect answer. Please try again.");
      genCaptcha();
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account…");

    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        country: form.country || "United States",
        dob: form.dob,
        password: form.password,
      });
      toast.dismiss(toastId);
      setCreatedName(form.firstName.trim());
      setShowSuccessModal(true);
      // AuthContext register() will redirect to /dashboard after 2s
    } catch (err) {
      const msg = err.message || "";
      let friendly = "Could not create account. Please try again.";

      if (
        msg.toLowerCase().includes("email already") ||
        msg.toLowerCase().includes("already exists") ||
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("409")
      ) {
        friendly =
          "An account with this email already exists. Try logging in instead.";
        // Take user back to step 0 to fix the email — but show toast, not inline error
        setStep(0);
        setFieldErrors({ email: "This email is already registered" });
      } else if (
        msg.toLowerCase().includes("network") ||
        msg.toLowerCase().includes("failed to fetch")
      ) {
        friendly = "Connection error. Check your internet and try again.";
      } else if (msg) {
        friendly = msg;
      }

      toast.error(friendly, { id: toastId, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  // ── Password strength ────────────────────────────────────────────────────────
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-[#6366F1]",
  ][strength];
  const strengthText = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-blue-500",
    "text-[#6366F1]",
  ][strength];

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
      fieldErrors[field]
        ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
        : "border-slate-200 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
    }`;

  const FieldError = ({ field }) =>
    fieldErrors[field] ? (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <>
      {/* ── Success Modal ─────────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-10 h-10 text-[#6366F1]"
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
            <h2 className="text-2xl font-bold text-[#0A0F1E] mb-2">
              Welcome, {createdName}! 🎉
            </h2>
            <p className="text-slate-500 text-sm mb-2">
              Your ApexVest account has been created successfully.
            </p>
            <p className="text-slate-400 text-xs mb-6">
              Redirecting you to your dashboard…
            </p>
            {/* Animated progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full animate-pulse"
                style={{ width: "100%" }}
              />
            </div>
            <div className="bg-[#EEF2FF] rounded-xl p-4 text-left space-y-2">
              <p className="text-[#6366F1] text-xs font-semibold uppercase tracking-wider">
                What&apos;s next
              </p>
              {[
                "Explore investment plans",
                "Fund your wallet",
                "Start earning daily returns",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <svg
                    className="w-4 h-4 text-[#6366F1] flex-shrink-0"
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
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex w-full">
        {/* Left branding */}
        <div className="hidden lg:flex lg:w-5/12 bg-[#0A0F1E] flex-col p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <Logo light />
          </div>
          <div className="relative z-10 mt-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start growing your wealth today
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Join 140,000+ investors across the US earning consistent returns
              with ApexVest Inc.
            </p>
            <div className="space-y-3">
              {[
                "No hidden fees or commissions",
                "Returns from 8% to 35% annually",
                "Withdraw anytime, within 24 hours",
                "Bank-grade security & encryption",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
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
                  </div>
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-slate-50 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6 lg:hidden">
              <Logo />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h1 className="text-2xl font-bold text-[#0A0F1E] mb-1">
                Create your account
              </h1>
              <p className="text-slate-500 text-sm mb-6">
                Step {step + 1} of 3 — {steps[step]}
              </p>

              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" : "bg-slate-200"}`}
                    />
                    <p
                      className={`text-xs mt-1.5 font-medium ${i <= step ? "text-[#6366F1]" : "text-slate-400"}`}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── STEP 0: Account ─────────────────────────────────── */}
              {step === 0 && (
                <form onSubmit={handleNext} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="john@email.com"
                      autoComplete="email"
                      className={inputClass("email")}
                    />
                    <FieldError field="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="+1 (800) 000-0000"
                      autoComplete="tel"
                      className={inputClass("phone")}
                    />
                    <FieldError field="phone" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                  >
                    Continue →
                  </button>
                </form>
              )}

              {/* ── STEP 1: Personal ────────────────────────────────── */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-5" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        placeholder="John"
                        autoComplete="given-name"
                        className={inputClass("firstName")}
                      />
                      <FieldError field="firstName" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        placeholder="Doe"
                        autoComplete="family-name"
                        className={inputClass("lastName")}
                      />
                      <FieldError field="lastName" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Country of Residence
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                      className={inputClass("country")}
                    >
                      <option value="">Select country</option>
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
                    <FieldError field="country" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setField("dob", e.target.value)}
                      className={inputClass("dob")}
                    />
                    <FieldError field="dob" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFieldErrors({});
                        setStep(0);
                      }}
                      className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                    >
                      Continue →
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 2: Security ────────────────────────────────── */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setField("password", e.target.value)}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        className={`${inputClass("password")} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                            strokeWidth={1.8}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* Strength meter */}
                    {form.password && (
                      <div className="mt-2">
                        <div className="flex gap-1.5 mb-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 h-1.5 rounded-full transition-all ${i <= strength ? strengthColor : "bg-slate-200"}`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${strengthText}`}>
                          {strengthLabel} password
                        </p>
                      </div>
                    )}
                    <FieldError field="password" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={form.confirm}
                      onChange={(e) => setField("confirm", e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      className={inputClass("confirm")}
                    />
                    <FieldError field="confirm" />
                  </div>

                  <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.agree}
                        onChange={(e) => setField("agree", e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        I agree to ApexVest Inc.&apos;s{" "}
                        <a href="#" className="text-[#6366F1] hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#6366F1] hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    <FieldError field="agree" />
                  </div>

                  {/* Captcha */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Security Check — Solve to continue
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-3">
                        <span className="text-base font-bold text-[#0A0F1E]">
                          {captcha.a} + {captcha.b} = ?
                        </span>
                        <button
                          type="button"
                          onClick={genCaptcha}
                          className="text-slate-400 hover:text-[#6366F1] ml-1"
                          title="New question"
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="number"
                        value={captcha.answer}
                        onChange={(e) => {
                          setCaptcha((c) => ({ ...c, answer: e.target.value }));
                          setCaptchaError("");
                        }}
                        placeholder="Your answer"
                        required
                        className="w-32 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 focus:border-[#6366F1]"
                      />
                    </div>
                    {captchaError && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {captchaError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFieldErrors({});
                        setStep(1);
                      }}
                      className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !captcha.answer || !form.agree}
                      className="flex-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
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
                          Creating account…
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#6366F1] font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
