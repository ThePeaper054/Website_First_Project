"use client";

import { AccessoriesSection } from "@/components/AccessoriesSection";
import { ArtworkSection } from "@/components/ArtworkSection";
import { WelcomeSection } from "@/components/WelcomeSection";
import { useLocale } from "@/i18n/LocaleProvider";

/**
 * Home page sections: welcome brand morph, artwork, accessories, and contact placeholder.
 */
export function HomeSections() {
  const { t } = useLocale();

  return (
    <main>
      <WelcomeSection />

      <ArtworkSection />

      <AccessoriesSection />

      <section
        id="contact"
        className="flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]"
      >
        <p className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal/45 sm:text-4xl">
          {t("nav.contact")}
        </p>
      </section>
    </main>
  );
}
