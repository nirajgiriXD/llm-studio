"use client";

/**
 * External dependencies.
 */
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({ children, ...props }) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
);
