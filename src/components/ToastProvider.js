"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-inter, sans-serif)",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          maxWidth: "380px",
        },
        success: {
          iconTheme: { primary: "#00C853", secondary: "#fff" },
          style: {
            background: "#fff",
            color: "#0A1628",
            border: "1px solid #E8FFF1",
          },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
          style: {
            background: "#fff",
            color: "#0A1628",
            border: "1px solid #fee2e2",
          },
        },
        loading: {
          iconTheme: { primary: "#00C853", secondary: "#fff" },
          style: {
            background: "#fff",
            color: "#0A1628",
            border: "1px solid #e2e8f0",
          },
        },
      }}
    />
  );
}
