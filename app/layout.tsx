import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CompLabs Inc.",
  description: "Building a foundational model to run complex mechanical simulations in seconds",
  openGraph: {
    title: "CompLabs Inc.",
    description: "Building a foundational model to run complex mechanical simulations in seconds",
    images: [
      {
        url: "/assets/metadata_image.png",
        alt: "CompLabs Inc.",
      }
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompLabs Inc.",
    description: "Building a foundational model to run complex mechanical simulations in seconds",
    images: "/assets/metadata_image.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  category: "technology",
  keywords: ["mechanical simulations", "AI", "simulation", "optimization", "design", "optimization"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
      <body className={inter.className + " flex flex-col bg-background text-foreground w-full justify-between min-h-screen"}>
        <div className="flex h-12 justify-center items-center">
          <Navbar />
        </div>
          {children}
        <Footer />
      </body>
    </html>
  );
}
