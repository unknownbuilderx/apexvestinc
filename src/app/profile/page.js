"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { userAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});

  // ── Fetch real profile from server ──────────────────────────────────────────
  useEffect(() => {
    userAPI
      .getProfile()
      .then((data) => {
        const u = data.user;
        setProfile(u);
        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phone: u.phone || "",
          country: u.country || "United States",
          city: u.city || "",
          dob: u.dob ? u.dob.slice(0, 10) : "",
          occupation: u.occupation || "",
          bio: u.bio || "",
        });
      })
      .catch(() => toast.error("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Saving profile…");
    try {
      const res = await userAPI.updateProfile(form);
      setProfile(res.user);
      updateUser(res.user); // update sidebar + auth context
      setEditing(false);
      toast.success("Profile updated!", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Could not save profile", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form back to saved profile
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        country: profile.country || "United States",
        city: profile.city || "",
        dob: profile.dob ? profile.dob.slice(0, 10) : "",
        occupation: profile.occupation || "",
        bio: profile.bio || "",
      });
    }
    setEditing(false);
  };

  // Derived display values
  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()
    : "??";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const kycStatus = profile?.kyc?.status || "Pending";
  const kycColor =
    kycStatus === "Verified"
      ? "bg-[#E8FFF1] text-[#00C853]"
      : kycStatus === "Rejected"
        ? "bg-red-50 text-red-500"
        : "bg-amber-50 text-amber-600";

  // ── Field component ──────────────────────────────────────────────────────────
  const Field = ({ label, name, type = "text", options, span }) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {editing ? (
        options ? (
          <select
            value={form[name]}
            onChange={(e) => set(name, e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853] text-[#0A1628]"
          >
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : name === "bio" ? (
          <textarea
            rows={3}
            value={form[name]}
            onChange={(e) => set(name, e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853] resize-none"
          />
        ) : (
          <input
            type={type}
            value={form[name]}
            onChange={(e) => set(name, e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
          />
        )
      ) : (
        <p className="text-[#0A1628] font-medium text-sm py-2.5 min-h-[2.5rem]">
          {form[name] || (
            <span className="text-slate-300 font-normal">Not set</span>
          )}
        </p>
      )}
    </div>
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-slate-400">
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
          Loading your profile…
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628]">My Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View and manage your personal information
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-[#00C853] hover:text-[#00C853] transition-colors"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left column: avatar + stats + links ─────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0A1628] to-[#112240] text-white text-2xl font-bold flex items-center justify-center mx-auto shadow-lg">
                  {initials}
                </div>
                {editing && (
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00C853] text-white flex items-center justify-center shadow-md">
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
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name + email */}
              <h3 className="font-bold text-[#0A1628] text-lg leading-tight">
                {form.firstName} {form.lastName}
              </h3>
              <p className="text-slate-400 text-sm mt-0.5">{form.email}</p>

              {/* KYC badge */}
              <div
                className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${kycColor}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${kycStatus === "Verified" ? "bg-[#00C853]" : kycStatus === "Rejected" ? "bg-red-400" : "bg-amber-400"}`}
                />
                KYC: {kycStatus}
              </div>

              {/* Stats grid */}
              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-xs text-slate-400">Member Since</p>
                  <p className="text-xs font-bold text-[#0A1628] mt-0.5">
                    {memberSince}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-xs text-slate-400">Account Status</p>
                  <p
                    className={`text-xs font-bold mt-0.5 ${profile?.status === "Active" ? "text-[#00C853]" : "text-red-500"}`}
                  >
                    {profile?.status || "Active"}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-xs text-slate-400">Wallet Balance</p>
                  <p className="text-xs font-bold text-[#0A1628] mt-0.5">
                    $
                    {(profile?.walletBalance || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <p className="text-xs text-slate-400">Referral Code</p>
                  <p className="text-xs font-bold text-[#00C853] mt-0.5 truncate">
                    {profile?.referralCode || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-1">
              {[
                { label: "Security Settings", href: "/security", icon: "🔒" },
                { label: "Notifications", href: "/notifications", icon: "🔔" },
                { label: "Help & Support", href: "/help", icon: "❓" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#00C853] transition-colors"
                >
                  <span>{l.icon}</span>
                  {l.label}
                  <svg
                    className="w-4 h-4 ml-auto text-slate-300"
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
              ))}
            </div>
          </div>

          {/* ── Right column: fields ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personal info */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#0A1628]">
                  Personal Information
                </h2>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="text-xs text-[#00C853] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="First Name" name="firstName" />
                <Field label="Last Name" name="lastName" />
                <Field label="Email Address" name="email" type="email" />
                <Field label="Phone Number" name="phone" type="tel" />
                <Field
                  label="Country"
                  name="country"
                  options={[
                    "United States",
                    "Canada",
                    "United Kingdom",
                    "Australia",
                    "Germany",
                    "France",
                    "Netherlands",
                    "Other",
                  ]}
                />
                <Field label="City" name="city" />
                <Field label="Date of Birth" name="dob" type="date" />
                <Field label="Occupation" name="occupation" />
              </div>
            </div>

            {/* About / bio */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0A1628] mb-5">About</h2>
              <Field label="Bio" name="bio" span />
            </div>

            {/* KYC */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-[#0A1628] mb-4">
                Identity Verification (KYC)
              </h2>
              <div className="space-y-3">
                {[
                  { doc: "Government ID", icon: "🪪" },
                  { doc: "Proof of Address", icon: "🏠" },
                  { doc: "Selfie / Liveness Check", icon: "🤳" },
                ].map((k) => (
                  <div
                    key={k.doc}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{k.icon}</span>
                      <span className="text-sm font-medium text-[#0A1628]">
                        {k.doc}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${kycColor}`}
                    >
                      {kycStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save / Cancel buttons */}
            {editing && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#00C853] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#00a844] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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
            )}
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
