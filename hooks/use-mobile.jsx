import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const subscribe = (onStoreChange) => {
  const mql = window.matchMedia(MOBILE_QUERY)

  mql.addEventListener("change", onStoreChange)

  return () => mql.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches

// The server has no viewport, so it renders the desktop layout.
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
