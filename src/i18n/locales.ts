export const locales = ["en", "he", "ar", "ru"] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "nara-locale";

export const LOCALE_COOKIE_KEY = "nara-locale";

export type LocaleMeta = {
  id: Locale;
  /** Native language name used for accessibility labels */
  nativeName: string;
  /** Path to the flag/icon SVG under /public */
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

/**
 * Document `dir` for a locale.
 */
export function localeDir(locale: Locale): "rtl" | "ltr" {
  return localeMeta[locale].rtl ? "rtl" : "ltr";
}

/**
 * Client preference order (must match {@link localeBootScript}):
 * localStorage → fallback (cookie/SSR) → default.
 */
export function resolveClientLocale(fallback: Locale = DEFAULT_LOCALE): Locale {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : fallback;
}

/**
 * Inline boot script: syncs `lang`/`dir` (and cookie) before paint.
 * Preference order matches {@link resolveClientLocale}: localStorage → cookie.
 */
export const localeBootScript = `(function(){try{var k=${JSON.stringify(LOCALE_COOKIE_KEY)};var locales=${JSON.stringify([...locales])};var rtl={he:1,ar:1};var locale=null;try{locale=localStorage.getItem(k);}catch(e){}if(!locale||locales.indexOf(locale)===-1){locale=null;var parts=document.cookie.split(";");for(var i=0;i<parts.length;i++){var p=parts[i].trim();if(p.indexOf(k+"=")===0){locale=decodeURIComponent(p.slice(k.length+1));break;}}}if(locales.indexOf(locale)!==-1){document.documentElement.lang=locale;document.documentElement.dir=rtl[locale]?"rtl":"ltr";document.cookie=k+"="+encodeURIComponent(locale)+";path=/;max-age=31536000;SameSite=Lax";}}catch(e){}})();`;
