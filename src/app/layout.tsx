import type { Metadata } from "next";
import { IBM_Plex_Serif, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
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

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${ibmPlexSerif.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30">
          <CommandMenu />
          <AppContainer>{children}</AppContainer>
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
