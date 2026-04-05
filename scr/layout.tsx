import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRJ Bot - نسخ سيرفرات ديسكورد",
  description: "أداة متقدمة لنسخ سيرفرات ديسكورد - رتب، رومات، إعدادات، وأكثر",
  keywords: ["Discord", "نسخ سيرفر", "TRJ Bot", "أدوات ديسكورد"],
  authors: [{ name: "Trj.py" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "TRJ Bot - نسخ سيرفرات ديسكورد",
    description: "أداة متقدمة لنسخ سيرفرات ديسكورد",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
