"use client";

import Image from "next/image";
import { useLocale } from "@/i18n/LocaleProvider";
import type { TranslationKey } from "@/i18n/dictionaries";
import { useEffect } from "react";

const navLinks = [
  { href: "#home", labelKey: "nav.home" },
  { href: "#gallery", labelKey: "nav.gallery" },
  { href: "#about", labelKey: "nav.about" },
  { href: "#contact", labelKey: "nav.contact" },
] as const satisfies ReadonlyArray<{
  href: string;
  labelKey: TranslationKey;
}>;

let scrollAnimationId = 0;

/**
 * Determines the height of the page header used as a navigation offset.
 *
 * @returns The header height in pixels, or `68` when no header is found.
 */
function getNavOffset() {
  const header = document.querySelector("header");
  return header?.getBoundingClientRect().height ?? 68;
}

/**
 * Calculates a cubic ease-out interpolation value.
 *
 * @param t - The normalized progress value, typically between `0` and `1`
 * @returns The interpolated progress value
 */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Smoothly scrolls to the section identified by a URL hash.
 *
 * @param hash - The hash identifying the target section.
 * @param updateHistory - Whether to add the hash to browser history.
 */
function scrollToSection(hash: string, updateHistory = true) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - getNavOffset(),
  );
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) {
    if (updateHistory) window.history.pushState(null, "", hash);
    return;
  }

  // ~3/4 of previous speed ⇒ duration × 4/3
  const duration = Math.min(1467, Math.max(600, Math.abs(distance) * 0.733));
  const animationId = ++scrollAnimationId;
  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (animationId !== scrollAnimationId) return;
    if (startTime === null) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);

  if (updateHistory) {
    window.history.pushState(null, "", hash);
  }
}

/**
 * Renders a fixed navigation header with smooth scrolling links to page sections.
 *
 * Synchronizes scrolling with the current URL hash and responds to hash changes.
 */
export function Nav() {
  const { t } = useLocale();

  useEffect(() => {
    const scrollFromLocation = () => {
      const { hash } = window.location;
      if (!hash) return;
      scrollToSection(hash, false);
    };

    const frame = window.requestAnimationFrame(scrollFromLocation);

    window.addEventListener("hashchange", scrollFromLocation);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollFromLocation);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] border-b border-charcoal/10 bg-surface backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <nav aria-label={t("nav.primaryAria")} className="min-w-0 flex-1">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="font-[family-name:var(--font-body)] text-sm font-medium tracking-wide text-charcoal/80 transition-colors hover:text-blush-deep sm:text-[0.95rem]"
                >
                  {t(link.labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#home"
          className="shrink-0"
          aria-label={t("nav.homeAria")}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("#home");
          }}
        >
          <Image
            src="/logo.svg"
            alt="Nara Nails"
            width={140}
            height={42}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>
      </div>
    </header>
  );
}
