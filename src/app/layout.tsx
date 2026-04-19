import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BARTER | Pure Service Exchange",
  description: "Zero-currency service exchange platform",
  manifest: "/manifest.json",
};

import AppContainer from "@/components/AppContainer";
import CommandMenu from "@/components/CommandMenu";
import { BottomNav } from "@/components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
        <CommandMenu />
        <AppContainer>{children}</AppContainer>
        <BottomNav />
      </body>
    </html>
  );
}
