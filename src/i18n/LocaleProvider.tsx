"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type TranslationKey } from "./dictionaries";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  localeDir,
  resolveClientLocale,
  type Locale,
} from "./locales";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Applies the active locale to the document root (`lang` and `dir`).
 */
function applyDocumentLocale(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = localeDir(locale);
}

/**
 * Persists locale to localStorage and a first-party cookie (for SSR).
 */
function persistLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent(locale)};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

/**
 * Provides locale state, translations, and document lang/dir updates.
 */
export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Same order as localeBootScript: localStorage → cookie/SSR fallback
    const next = resolveClientLocale(initialLocale);
    setLocaleState(next);
    applyDocumentLocale(next);
    persistLocale(next);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    applyDocumentLocale(next);
    persistLocale(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? dictionaries.en[key],
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Accesses the current locale, setter, and translation helper.
 *
 * @throws When used outside of {@link LocaleProvider}.
 */
export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
