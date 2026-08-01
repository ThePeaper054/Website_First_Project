"use client";

import { ArtworkSection } from "@/components/ArtworkSection";
import { useLocale } from "@/i18n/LocaleProvider";
import type { TranslationKey } from "@/i18n/dictionaries";

const placeholderSections = [
  { id: "accessories", labelKey: "nav.accessories" },
  { id: "contact", labelKey: "nav.contact" },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: TranslationKey;
}>;

/**
 * Home page sections: artwork product scroller plus remaining placeholders.
 */
export function HomeSections() {
  const { t } = useLocale();

  return (
    <main>
      <section
        id="home"
        className="flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]"
      >
        <p className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal/45 sm:text-4xl">
          {t("nav.home")}
        </p>
      </section>

      <ArtworkSection />

      {placeholderSections.map((section) => (
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
