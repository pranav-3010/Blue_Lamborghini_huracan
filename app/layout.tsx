import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blue Lamborghini Huracán | Scrollytelling Showcase",
  description: "Experience the design, chassis, and raw V10 performance of the Blue Lamborghini Huracán in an immersive, scroll-controlled interactive environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} antialiased`}
    >
      <body className="bg-[#1a1a1a] text-white">
        {children}
      </body>
    </html>
  );
}

