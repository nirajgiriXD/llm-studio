"use client";

/**
 * External dependencies.
 */
import { useSyncExternalStore } from "react";

// Hydration state never changes after the first client render, so the store
// needs no real subscription.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Whether the component is running in the browser after hydration.
 *
 * Use it to gate anything that can only be known client-side (the platform,
 * the resolved theme) without risking a hydration mismatch.
 *
 * @returns {boolean} True once hydrated.
 */
const useIsHydrated = () =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

export default useIsHydrated;
