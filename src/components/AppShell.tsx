"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  MenuModalityProvider,
  useMenuModality,
} from "@/components/MenuModality";
import { Nav } from "@/components/Nav";
import type { ReactNode } from "react";

/**
 * Renders navigation, page content, and language controls with menu-aware accessibility behavior.
 *
 * @param children - The page content rendered within the application shell.
 * @returns The application shell content.
 */
function AppShellContent({ children }: { children: ReactNode }) {
  const { menuOpen } = useMenuModality();

  return (
    <>
      <Nav />
      <div inert={menuOpen ? true : undefined} aria-hidden={menuOpen}>
        {children}
      </div>
      <div inert={menuOpen ? true : undefined} aria-hidden={menuOpen}>
        <LanguageSwitcher />
      </div>
    </>
  );
}

/**
 * App chrome: nav, page content, and language switcher with menu modality.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <MenuModalityProvider>
      <AppShellContent>{children}</AppShellContent>
    </MenuModalityProvider>
  );
}
