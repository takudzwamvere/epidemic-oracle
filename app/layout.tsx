import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import DefaultHeader from "@/components/layout/default/Header";
import DefaultFooter from "@/components/layout/default/Footer";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
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
      <body className={`${poppins} antialiased min-h-svh w-full flex flex-col items-center justify-between`}>
        <DefaultHeader/>
        <section>
          {children}
        </section>
        <DefaultFooter/>
      </body>
    </html>
  );
}
