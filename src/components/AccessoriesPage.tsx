"use client";

import { ProductCard } from "@/components/ProductCard";
import { useLocale } from "@/i18n/LocaleProvider";
import { ACCESSORIES_PRODUCTS } from "@/lib/products";
import { useEffect, useRef } from "react";

/**
 * Accessories catalog page: title, hint, and a product grid of accessory-only items.
 */
export function AccessoriesPage() {
  const { t } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="px-6 pt-[var(--nav-height)] pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 pt-10 text-center sm:pt-14">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal outline-none sm:text-4xl"
          >
            {t("accessories.title")}
          </h1>
          <p className="mt-3 mx-auto max-w-md font-[family-name:var(--font-body),var(--font-arabic),var(--font-cyrillic)] text-sm text-charcoal/50 sm:text-base">
            {t("accessories.hint")}
          </p>
        </header>

        <ul className="grid list-none grid-cols-2 gap-4 sm:grid-cols-3">
          {ACCESSORIES_PRODUCTS.map((product) => (
            <li key={product.id} className="group">
              <ProductCard
                product={product}
                headingLevel={2}
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
