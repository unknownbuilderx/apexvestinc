import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Grow Vest Inc. — Invest Smarter, Grow Faster",
  description:
    "Grow Vest Inc. is a premium investment platform helping you build wealth through smart, diversified portfolios. Start investing today.",
  keywords: "invest, portfolio, wealth, fintech, grow vest, investments",
  openGraph: {
    title: "Grow Vest Inc.",
    description: "Invest Smarter, Grow Faster",
    type: "website",
  },
};

// Critical: viewport must be exported separately in Next.js App Router
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A1628",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
