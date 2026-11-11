"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const allNotifications = [
  {
    id: 1,
    category: "Returns",
    icon: "📈",
    title: "Daily ROI Credited",
    body: "Your Growth Plan earned $48.50 today. Total returns: $4,820.00",
    time: "2 hours ago",
    date: "Oct 2, 2026",
    read: false,
  },
  {
    id: 2,
    category: "Deposit",
    icon: "💳",
    title: "Deposit Confirmed",
    body: "Your bank transfer of $5,000.00 has been confirmed and added to your wallet.",
    time: "5 hours ago",
    date: "Oct 2, 2026",
    read: false,
  },
  {
    id: 3,
    category: "Returns",
    icon: "📈",
    title: "Daily ROI Credited",
    body: "Your Premium Plan earned $32.20 today.",
    time: "2 hours ago",
    date: "Oct 2, 2026",
    read: false,
  },
  {
    id: 4,
    category: "Security",
    icon: "🔒",
    title: "New Login Detected",
    body: "A new login was detected from Austin, TX on Chrome/macOS. If this wasn't you, secure your account immediately.",
    time: "Yesterday",
    date: "Oct 1, 2026",
    read: true,
  },
  {
    id: 5,
    category: "Withdrawal",
    icon: "🏦",
    title: "Withdrawal Processed",
    body: "Your withdrawal of $2,000.00 to Chase Bank (••••1234) has been processed successfully.",
    time: "4 days ago",
    date: "Sep 28, 2026",
    read: true,
  },
  {
    id: 6,
    category: "System",
    icon: "📊",
    title: "Monthly Report Ready",
    body: "Your September 2026 investment report is now available. Tap to view your full performance breakdown.",
    time: "3 days ago",
    date: "Sep 30, 2026",
    read: true,
  },
  {
    id: 7,
    category: "Returns",
    icon: "🎉",
    title: "Milestone Reached!",
    body: "Congratulations! Your total returns have crossed $9,000. Keep growing!",
    time: "1 week ago",
    date: "Sep 25, 2026",
    read: true,
  },
  {
    id: 8,
    category: "Security",
    icon: "✅",
    title: "2FA Enabled",
    body: "Two-factor authentication has been successfully enabled on your account.",
    time: "2 weeks ago",
    date: "Sep 18, 2026",
    read: true,
  },
  {
    id: 9,
    category: "System",
    icon: "📣",
    title: "New Plan Available",
    body: "The Premium Plus plan is now live with returns up to 40% annually. Be among the first to invest.",
    time: "3 weeks ago",
    date: "Sep 10, 2026",
    read: true,
  },
];

const categories = [
  "All",
  "Returns",
  "Deposit",
  "Withdrawal",
  "Security",
  "System",
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered = notifications.filter(
    (n) => filter === "All" || n.category === filter,
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id) =>
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const categoryColor = {
    Returns: "bg-[#E8FFF1] text-[#00C853]",
    Deposit: "bg-blue-50 text-blue-600",
    Withdrawal: "bg-red-50 text-red-500",
    Security: "bg-amber-50 text-amber-600",
    System: "bg-purple-50 text-purple-600",
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0A1628]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-[#00C853] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Stay updated on your account activity
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-[#00C853] font-semibold hover:underline flex-shrink-0"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === c
                ? "bg-[#0A1628] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <p className="text-4xl mb-3">🔔</p>
            <p className="font-medium">No notifications in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50 ${!n.read ? "bg-[#E8FFF1]/40" : ""}`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`font-semibold text-sm ${!n.read ? "text-[#0A1628]" : "text-slate-700"}`}
                        >
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#00C853] flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor[n.category]}`}
                        >
                          {n.category}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5">
                    {n.time} · {n.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification settings hint */}
      <div className="mt-4 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-sm text-slate-500">
          Want to manage which notifications you receive?
        </p>
        <a
          href="/security"
          className="text-sm text-[#00C853] font-semibold hover:underline flex-shrink-0"
        >
          Notification Settings →
        </a>
      </div>
    </DashboardLayout>
  );
}
