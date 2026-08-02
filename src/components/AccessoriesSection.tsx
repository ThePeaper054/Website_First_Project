"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useLocale } from "@/i18n/LocaleProvider";
import { ACCESSORIES_PRODUCTS } from "@/lib/products";

/**
 * Home accessories section: title + All accessories link, and a four-product row.
 */
export function AccessoriesSection() {
  const { t } = useLocale();

  return (
    <section
      id="accessories"
      className="flex min-h-screen flex-col justify-center px-6 pt-[var(--nav-height)] pb-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal sm:text-4xl">
            {t("nav.accessories")}
          </h2>
          <Link
            href="/accessories"
            className="font-[family-name:var(--font-body),var(--font-arabic),var(--font-cyrillic)] text-base tracking-wide text-charcoal/85 transition-colors duration-300 hover:text-blush-deep sm:text-lg"
          >
            {t("nav.allAccessories")}
          </Link>
        </div>

        <ul className="grid list-none grid-cols-2 gap-4 sm:grid-cols-4">
          {ACCESSORIES_PRODUCTS.map((product) => (
            <li key={product.id} className="group">
              <ProductCard
                product={product}
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
