import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles-fix.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pairsy - Adventures are better shared",
  description: "Meet other couples for shared activities and adventures",
  icons: {
    icon: "/favicon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ fontFamily: inter.style.fontFamily }}>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
