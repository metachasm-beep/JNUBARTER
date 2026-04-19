import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const firaCode = Fira_Code({
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

import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html
        lang="en"
        className={`${firaSans.variable} ${firaCode.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
          <CommandMenu />
          <AppContainer>{children}</AppContainer>
          <BottomNav />
        </body>
      </html>
    </AuthProvider>
  );
}
