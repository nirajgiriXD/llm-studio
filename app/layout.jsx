/**
 * External dependencies.
 */
import localFont from "next/font/local";

/**
 * Internal dependencies.
 */
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppDataProvider from "@/providers/AppDataProvider";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

// Page metadata.
export const metadata = {
  title: "LLM Studio",
  description:
    "A comprehensive Next.js application for running and exploring .gguf open-source LLM models locally.",
  applicationName: "LLM Studio",
  // Icons come from the app/icon.svg and app/favicon.ico file conventions, so
  // they are fingerprinted and linked automatically.
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1d" },
  ],
};

export default function RootLayout({ children }) {
  return (
    // `suppressHydrationWarning` covers the theme class that next-themes writes
    // to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={300}>
            <AppDataProvider>
              <a
                href="#chat-composer-input"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
              >
                Skip to the message box
              </a>
              {children}
              <Toaster position="bottom-right" closeButton richColors />
            </AppDataProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
