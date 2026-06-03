import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteName, siteUrl } from "./lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Loyalty Automation | Industrial Automation Products",
    template: `%s | ${siteName}`,
  },
  description: "Industrial automation products, brochures, specifications, and B2B inquiry workflow.",
  keywords: [
    "industrial automation",
    "automation products",
    "PLC",
    "HMI",
    "AC drives",
    "DC drives",
    "servo systems",
    "Loyalty Automation",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo123.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
