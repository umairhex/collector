import type { Metadata, Viewport } from "next";
import { Nunito, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Collector | Premium Personal Knowledge Base",
  description:
    "A high-performance, minimalist personal knowledge base built for focus and precision.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Collector",
    description: "Premium Personal Knowledge Base",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Collector",
    description: "Premium Personal Knowledge Base",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${bebasNeue.variable} font-sans antialiased`}
      >
        <NuqsAdapter>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider delayDuration={0}>
                {children}
                <Toaster />
                <ServiceWorkerRegistration />
              </TooltipProvider>
            </ThemeProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
