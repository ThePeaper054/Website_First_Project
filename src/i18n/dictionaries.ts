import type { Locale } from "./locales";

export type TranslationKey =
  | "nav.home"
  | "nav.gallery"
  | "nav.about"
  | "nav.contact"
  | "nav.homeAria"
  | "nav.primaryAria"
  | "lang.switcherAria";

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "nav.home": "Home",
  "nav.gallery": "Gallery",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.homeAria": "Nara Nails home",
  "nav.primaryAria": "Primary",
  "lang.switcherAria": "Change language",
};

const he: Dictionary = {
  "nav.home": "בית",
  "nav.gallery": "גלריה",
  "nav.about": "אודות",
  "nav.contact": "צור קשר",
  "nav.homeAria": "נרה ניילס — דף הבית",
  "nav.primaryAria": "ניווט ראשי",
  "lang.switcherAria": "החלפת שפה",
};

const ar: Dictionary = {
  "nav.home": "الرئيسية",
  "nav.gallery": "المعرض",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.homeAria": "نارا نيلز — الصفحة الرئيسية",
  "nav.primaryAria": "التنقل الرئيسي",
  "lang.switcherAria": "تغيير اللغة",
};

const ru: Dictionary = {
  "nav.home": "Главная",
  "nav.gallery": "Галерея",
  "nav.about": "О нас",
  "nav.contact": "Контакты",
  "nav.homeAria": "Nara Nails — главная",
  "nav.primaryAria": "Основная навигация",
  "lang.switcherAria": "Сменить язык",
};

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  he,
  ar,
  ru,
};
