/**
 * External dependencies.
 */
import localFont from "next/font/local";

/**
 * Internal dependencies.
 */
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppDataProvider from "@/providers/AppDataProvider";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Page metadata.
export const metadata = {
  title: "LLM Studio",
  description:
    "A comprehensive Next.js application for running and exploring .gguf open-source LLM models locally.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppDataProvider>
          {children}
          <Toaster />
        </AppDataProvider>
      </body>
    </html>
  );
}
