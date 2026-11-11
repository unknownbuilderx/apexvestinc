"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear that field's error as user types
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    if (!form.email) errors.email = "Email is required";
    if (!form.password) errors.password = "Password is required";
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing you in…");
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.firstName}! 👋`, { id: toastId });
    } catch (err) {
      const msg = err.message || "";
      // Map backend messages to clear user-facing language
      let friendly = "Something went wrong. Please try again.";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("password") ||
        msg.toLowerCase().includes("credentials") ||
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("incorrect")
      ) {
        friendly = "Invalid email or password. Please check your details.";
        setFieldErrors({ email: " ", password: " " }); // highlight both fields
      } else if (msg.toLowerCase().includes("suspended")) {
        friendly = "Your account has been suspended. Contact support.";
      } else if (
        msg.toLowerCase().includes("network") ||
        msg.toLowerCase().includes("failed to fetch")
      ) {
        friendly =
          "Could not connect to the server. Check your internet connection.";
      } else if (msg) {
        friendly = msg;
      }

      toast.error(friendly, { id: toastId, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors ${
      fieldErrors[field] && fieldErrors[field].trim()
        ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400"
        : "border-slate-200 focus:ring-[#00C853]/30 focus:border-[#00C853]"
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A1628] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#00C853 1px, transparent 1px), linear-gradient(90deg, #00C853 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00C853]/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Logo light />
        </div>
        <div className="relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#00C853] text-white text-xs font-bold flex items-center justify-center">
                AM
              </div>
              <div>
                <p className="text-white text-sm font-medium">Ashley Monroe</p>
                <p className="text-slate-400 text-xs">
                  Premium Investor · New York
                </p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              &ldquo;My portfolio grew 23% in 8 months. Grow Vest is the most
              transparent platform I&apos;ve ever used.&rdquo;
            </p>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-amber-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: "$2.4B+", label: "AUM" },
              { val: "18.7%", label: "Avg. ROI" },
              { val: "140K+", label: "Investors" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[#00C853] font-bold text-lg">{s.val}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-[#0A1628] mb-1">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              Sign in to your Grow Vest account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
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
                {fieldErrors.email && fieldErrors.email.trim() && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
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
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#00C853] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                        d={
                          showPassword
                            ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        }
                      />
                    </svg>
                  </button>
                </div>
                {fieldErrors.password && fieldErrors.password.trim() && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
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
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00C853] text-white font-semibold py-3.5 rounded-xl hover:bg-[#00a844] transition-colors text-sm disabled:opacity-70 flex items-center justify-center gap-2"
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
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#00C853] font-semibold hover:underline"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
