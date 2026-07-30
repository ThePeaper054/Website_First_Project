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
  LOCALE_STORAGE_KEY,
  isLocale,
  localeMeta,
  type Locale,
} from "./locales";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Applies the active locale to the document root (`lang` and `dir`).
 */
function applyDocumentLocale(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = localeMeta[locale].rtl ? "rtl" : "ltr";
}

/**
 * Provides locale state, translations, and document lang/dir updates.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const initial = isLocale(stored) ? stored : DEFAULT_LOCALE;
    setLocaleState(initial);
    applyDocumentLocale(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    applyDocumentLocale(locale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, hydrated]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
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
