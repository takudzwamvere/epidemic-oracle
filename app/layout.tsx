import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Epidemic Oracle | Epidemic Prediction & Surveillance",
    template: "%s | Epidemic Oracle",
  },
  description: "Machine Learning Powered epidemic prediction and outbreak surveillance platform for Southern and Central Africa.",
  keywords: [
    "Epidemic Oracle",
    "Epidemic Prediction",
    "Disease Surveillance",
    "Machine Learning",
    "ARIMA Forecasting",
    "Public Health",
    "Africa",
  ],
  authors: [{ name: "Epidemic Oracle Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Epidemic Oracle | Epidemic Prediction & Surveillance",
    description: "Machine Learning Powered epidemic prediction and outbreak surveillance platform for Southern and Central Africa.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-svh w-full bg-gray-50`}>
        {children}
        <Script 
          defer 
          src="https://analytics.takudzwamvere.com/script.js" 
          data-website-id="12f305fd-b362-40e3-9f02-103ee44165a5" 
        />
      </body>
    </html>
  );
}
