import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Block Phone — Built to Evolve",
  description: "Experience the future of mobile technology. A luxury modular smartphone concept with magnetic, interchangeable hardware modules. Designed to be taken apart, upgraded, and personalized.",
  keywords: ["Block Phone", "Modular Smartphone", "Futuristic Technology", "Luxury Tech", "Magnetic Hardware", "Upgrade Phone"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#050505] text-white`}
      >
        {children}
      </body>
    </html>
  );
}

