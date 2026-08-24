import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Epidemic Oracle | Home",
  description: "Machine Learning Powered epidemic prediction",
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



