import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import Script from "next/script";
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

import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <QueryProvider>
        <html
          lang="en"
          className={`${firaSans.variable} ${firaCode.variable} h-full antialiased`}
        >
          <head>
            <meta name="google-site-verification" content="E-1cSMTzl78PGugEqO7xJ7-dCk8Xsf1PMMQ4RoRe7bI" />
            <meta name="google-adsense-account" content="ca-pub-8618345567810746" />
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8618345567810746"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </head>
          <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
            <CommandMenu />
            <AppContainer>{children}</AppContainer>
          </body>
        </html>
      </QueryProvider>
    </AuthProvider>
  );
}
