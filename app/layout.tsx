import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import FluidBackground from "@/components/FluidBackground";

export const metadata: Metadata = {
  title: "Composition Labs",
  description: "Composition Labs",
  icons: {
    icon: '/favicon.ico',
  }
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
      <body className={inter.className + " flex flex-col w-full mx-auto"}>
        <FluidBackground className="fixed inset-0 w-screen h-screen">
          {children}
        </FluidBackground>
      </body>
    </html>
  );
}
