import Footer from "@/components/Footer";
import Sidebar from "@/components/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Composition Labs",
  description: "Reducing the time and compute required for mechanical simulations"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VX1EWQBHNC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VX1EWQBHNC');
          `}
        </Script>
      </head>
      <body className={inter.className + " flex flex-col h-screen bg-white mx-auto"}>
        <div className="flex flex-col md:flex-row">
          <Sidebar />
          <div className="px-4 md:px-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
