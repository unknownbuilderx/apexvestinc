// ─── Base URL resolution ──────────────────────────────────────────────────────
// NEXT_PUBLIC_API_URL is baked in at build time.
// For Firebase hosting: set this in .env.production before running `npm run build`
// For Vercel hosting:   set it in Vercel project env vars dashboard
// Fallback chain: env var → production URL.
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://grow-vest-lemon.vercel.app/api";

// ─── Token helpers ────────────────────────────────────────────────────────────
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gv_token");
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "omit", // Bearer token auth — no cookies needed
    });
  } catch (networkErr) {
    throw new Error(
      "Network error — check your internet connection and try again.",
    );
  }

  // Handle empty responses (e.g. 204 No Content)
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  changePassword: (body) =>
    request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  forgotPassword: (body) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resetPassword: (body) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => request("/users/profile"),
  updateProfile: (body) =>
    request("/users/profile", { method: "PUT", body: JSON.stringify(body) }),
  getDashboard: () => request("/users/dashboard"),
  getBankAccounts: () => request("/users/bank-accounts"),
  addBankAccount: (body) =>
    request("/users/bank-accounts", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  removeBankAccount: (id) =>
    request(`/users/bank-accounts/${id}`, { method: "DELETE" }),
};

// ─── Investments ──────────────────────────────────────────────────────────────
export const investmentAPI = {
  getPlans: () => request("/investments/plans"),
  getAll: (q) =>
    request(`/investments${q ? "?" + new URLSearchParams(q) : ""}`),
  getById: (id) => request(`/investments/${id}`),
  create: (body) =>
    request("/investments", { method: "POST", body: JSON.stringify(body) }),
  cancel: (id) => request(`/investments/${id}`, { method: "DELETE" }),
};

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactionAPI = {
  getAll: (q) =>
    request(`/transactions${q ? "?" + new URLSearchParams(q) : ""}`),
  getById: (id) => request(`/transactions/${id}`),
  deposit: (body) =>
    request("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ─── Withdrawals ──────────────────────────────────────────────────────────────
export const withdrawalAPI = {
  getAll: (q) =>
    request(`/withdrawals${q ? "?" + new URLSearchParams(q) : ""}`),
  getById: (id) => request(`/withdrawals/${id}`),
  request: (body) =>
    request("/withdrawals", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: (q) =>
    request(`/notifications${q ? "?" + new URLSearchParams(q) : ""}`),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => request("/notifications/read-all", { method: "PUT" }),
  delete: (id) => request(`/notifications/${id}`, { method: "DELETE" }),
};

// ─── Messages (user ↔ admin support) ─────────────────────────────────────────
export const messageAPI = {
  getAll: () => request("/messages"),
  send: (body) =>
    request("/messages", { method: "POST", body: JSON.stringify(body) }),
  delete: (id) => request(`/messages/${id}`, { method: "DELETE" }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => request("/admin/stats"),
  getAllUsers: (q) =>
    request(`/admin/users${q ? "?" + new URLSearchParams(q) : ""}`),
  getUserById: (id) => request(`/admin/users/${id}`),
  createUser: (body) =>
    request("/admin/users", { method: "POST", body: JSON.stringify(body) }),
  updateUser: (id, body) =>
    request(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  updateBalance: (id, body) =>
    request(`/admin/users/${id}/balance`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  updateDepositTransaction: (id, body) =>
    request(`/admin/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  createTransaction: (userId, body) =>
    request(`/admin/users/${userId}/transactions`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteTransaction: (id) =>
    request(`/admin/transactions/${id}`, { method: "DELETE" }),
  updateDashboardMetrics: (id, body) =>
    request(`/admin/users/${id}/dashboard-metrics`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  updateReturns: (id, body) =>
    request(`/admin/users/${id}/returns`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  updatePortfolioGrowth: (id, body) =>
    request(`/admin/users/${id}/portfolio-growth`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  updatePendingInvestment: (id, body) =>
    request(`/admin/users/${id}/pending-investment`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  updateInvestment: (id, body) =>
    request(`/admin/investments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  getWithdrawals: (q) =>
    request(`/admin/withdrawals${q ? "?" + new URLSearchParams(q) : ""}`),
  updateWithdrawal: (id, body) =>
    request(`/admin/withdrawals/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  updateWithdrawalDetails: (id, body) =>
    request(`/admin/withdrawals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  getInvestments: (q) =>
    request(`/admin/investments${q ? "?" + new URLSearchParams(q) : ""}`),
  getMessages: () => request("/admin/messages"),
  getThread: (userId) => request(`/admin/messages/${userId}`),
  replyToUser: (userId, body) =>
    request(`/admin/messages/${userId}/reply`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteMessage: (msgId) =>
    request(`/admin/messages/${msgId}`, { method: "DELETE" }),
};
