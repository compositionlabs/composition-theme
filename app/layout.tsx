import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import FluidBackground from "@/components/FluidBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://jacobian.co"),
  title: "Jacobian — AI-native metal production",
  description:
    "Jacobian is AI-native metal production: AI for running metal factories.",
  openGraph: {
    title: "Jacobian — AI-native metal production",
    description: "AI for running metal factories.",
    url: "https://jacobian.co",
    siteName: "Jacobian",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Jacobian — AI-native metal production",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jacobian — AI-native metal production",
    description: "AI for running metal factories.",
    images: ["/og.jpg"],
  },
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
