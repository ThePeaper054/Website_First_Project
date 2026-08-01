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
 * Provides access to the menu drawer state and setter.
 *
 * @returns The current menu state and a function for updating it.
 * @throws An error if called outside `MenuModalityProvider`.
 */
export function useMenuModality() {
  const ctx = useContext(MenuModalityContext);
  if (!ctx) {
    throw new Error("useMenuModality must be used within MenuModalityProvider");
  }
  return ctx;
}

/**
 * Provides menu drawer state and controls to descendant components.
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
