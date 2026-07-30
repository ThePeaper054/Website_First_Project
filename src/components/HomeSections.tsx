"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import type { TranslationKey } from "@/i18n/dictionaries";

const sections = [
  { id: "home", labelKey: "nav.home" },
  { id: "gallery", labelKey: "nav.gallery" },
  { id: "about", labelKey: "nav.about" },
  { id: "contact", labelKey: "nav.contact" },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: TranslationKey;
}>;

/**
 * Translated full-page section placeholders for the home page.
 */
export function HomeSections() {
  const { t } = useLocale();

  return (
    <main>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]"
        >
          <p className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal/45 sm:text-4xl">
            {t(section.labelKey)}
          </p>
        </section>
      ))}
    </main>
  );
}
