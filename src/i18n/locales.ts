export const locales = ["en", "he", "ar", "ru"] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "nara-locale";

export type LocaleMeta = {
  id: Locale;
  /** Native language name used for accessibility labels */
  nativeName: string;
  /** Path to the flag SVG under /public */
  flagSrc: string;
  rtl: boolean;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: {
    id: "en",
    nativeName: "English",
    flagSrc: "/flags/us.svg",
    rtl: false,
  },
  he: {
    id: "he",
    nativeName: "עברית",
    flagSrc: "/flags/il.svg",
    rtl: true,
  },
  ar: {
    id: "ar",
    nativeName: "العربية",
    flagSrc: "/flags/eg.svg",
    rtl: true,
  },
  ru: {
    id: "ru",
    nativeName: "Русский",
    flagSrc: "/flags/ru.svg",
    rtl: false,
  },
};

/**
 * Returns whether the given value is a supported locale id.
 */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}
