"use client";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { messageAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await messageAPI.getAll();
      setMessages(res.messages || []);
    } catch (e) {
      toast.error(e.message || "Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const toastId = toast.loading("Sending message…");
    try {
      const res = await messageAPI.send({
        subject: subject.trim() || "Support Request",
        body: body.trim(),
      });
      setMessages((m) => [...m, res.message]);
      setBody("");
      setSubject("");
      setShowForm(false);
      toast.success("Message sent! We'll reply soon.", { id: toastId });
    } catch (e) {
      toast.error(e.message || "Failed to send message", { id: toastId });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await messageAPI.delete(id);
      setMessages((m) => m.filter((msg) => msg._id !== id));
      toast.success("Message deleted");
    } catch (e) {
      toast.error(e.message || "Could not delete message");
    }
  };

  const fmt = (d) =>
    new Date(d).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const adminReplies = messages.filter((m) => m.senderRole === "admin");
  const unread = adminReplies.filter((m) => !m.isRead).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0A1628]">Messages</h1>
            {unread > 0 && (
              <span className="bg-[#00C853] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unread} new
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Your support conversation with ApexVest
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
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
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Message
        </button>
      </div>

      {/* New message form */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-[#0A1628] mb-4">
            Send a message to support
          </h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Withdrawal issue, Account question…"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe your issue or question in detail…"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || !body.trim()}
                className="flex-1 bg-[#00C853] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#00a844] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
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
                    Sending…
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Thread */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Thread header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#0A1628]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00C853] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                ApexVest Support
              </p>
              <p className="text-[#00C853] text-xs">
                Typically replies within a few hours
              </p>
            </div>
          </div>
          <button
            onClick={loadMessages}
            className="text-slate-400 hover:text-white text-xs"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 min-h-[320px] max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <svg
                className="w-7 h-7 animate-spin text-[#00C853]"
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
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-medium text-[#0A1628]">No messages yet</p>
              <p className="text-sm mt-1">
                Send a message to get support from our team.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-block bg-[#00C853] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#00a844] transition-colors"
              >
                Send First Message
              </button>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.senderRole === "user";
              return (
                <div
                  key={msg._id}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isUser ? "bg-[#0A1628] text-white" : "bg-[#00C853] text-white"}`}
                  >
                    {isUser
                      ? `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`
                      : "GV"}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[75%] group`}>
                    {/* Subject line for user messages */}
                    {isUser &&
                      msg.subject &&
                      msg.subject !== "Support Request" && (
                        <p className="text-xs text-slate-400 mb-1 text-right">
                          {msg.subject}
                        </p>
                      )}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-[#0A1628] text-white rounded-tr-sm" : "bg-[#E8FFF1] text-[#0A1628] rounded-tl-sm border border-[#00C853]/20"}`}
                    >
                      {!isUser && (
                        <p className="text-[10px] font-bold text-[#00C853] uppercase tracking-wider mb-1">
                          ApexVest Support
                        </p>
                      )}
                      {msg.body}
                    </div>
                    <div
                      className={`flex items-center gap-2 mt-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <p className="text-xs text-slate-400">
                        {fmt(msg.createdAt)}
                      </p>
                      {isUser && (
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="text-xs text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick reply bar */}
        {messages.length > 0 && (
          <form
            onSubmit={handleSend}
            className="flex gap-3 p-4 border-t border-slate-100"
          >
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Reply to support…"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C853]/30 focus:border-[#00C853]"
            />
            <button
              type="submit"
              disabled={sending || !body.trim()}
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
        )}
      </div>
    </DashboardLayout>
  );
}
