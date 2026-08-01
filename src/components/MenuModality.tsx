"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MenuModalityContextValue = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const MenuModalityContext = createContext<MenuModalityContextValue | null>(
  null,
);

/**
 * Lets the nav report drawer open state so page chrome can become inert.
 */
export function useMenuModality() {
  const ctx = useContext(MenuModalityContext);
  if (!ctx) {
    throw new Error("useMenuModality must be used within MenuModalityProvider");
  }
  return ctx;
}

/**
 * Provides menu-open state for inert page chrome while the drawer is open.
 */
export function MenuModalityProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpenState] = useState(false);
  const setMenuOpen = useCallback((open: boolean) => {
    setMenuOpenState(open);
  }, []);
  const value = useMemo(
    () => ({ menuOpen, setMenuOpen }),
    [menuOpen, setMenuOpen],
  );

  return (
    <MenuModalityContext.Provider value={value}>
      {children}
    </MenuModalityContext.Provider>
  );
}
