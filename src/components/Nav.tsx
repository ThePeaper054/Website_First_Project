"use client";

import { useMenuModality } from "@/components/MenuModality";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { SHOP_CATEGORIES, shopCategoryHref } from "@/lib/shopCategories";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

let scrollAnimationId = 0;
let scrollWhenReadyId = 0;

/** Legacy section hashes that map to a current section id. */
const SECTION_ALIASES: Record<string, string> = {
  about: "accessories",
  gallery: "artwork",
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

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
 * Converts a section hash to its canonical form, including legacy aliases.
 *
 * @param hash - A section identifier with or without a leading hash
 * @returns The canonical section hash
 */
function resolveSectionHash(hash: string) {
  const normalized = hash.startsWith("#") ? hash : `#${hash}`;
  const id = normalized.slice(1);
  const canonical = SECTION_ALIASES[id] ?? id;
  return `#${canonical}`;
}

/**
 * Updates the URL hash without adding a history entry.
 */
function replaceHash(hash: string) {
  const url = `${window.location.pathname}${window.location.search}${hash}`;
  window.history.replaceState(null, "", url);
}

/**
 * Cancels in-flight smooth scrolls and scroll-when-ready retries.
 */
function cancelPendingScrolls() {
  scrollAnimationId += 1;
  scrollWhenReadyId += 1;
}

/**
 * Scrolls to the section identified by a URL hash.
 *
 * @param hash - The hash identifying the target section.
 * @param updateHistory - Whether to sync the hash into the URL (replaceState).
 * @param smooth - When true, eases to the section; when false, jumps instantly.
 * @returns Whether the target section was found.
 */
function scrollToSection(hash: string, updateHistory = true, smooth = true) {
  const normalized = resolveSectionHash(hash);
  const id = normalized.slice(1);
  const el = document.getElementById(id);
  if (!el) return false;

  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - getNavOffset(),
  );
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (updateHistory) {
    replaceHash(normalized);
  } else if (window.location.hash !== normalized) {
    // Canonicalize legacy aliases (e.g. #about → #accessories) without scrolling history.
    replaceHash(normalized);
  }

  if (Math.abs(distance) < 1) return true;

  // Cross-page / cold loads teleport; same-page menu links glide.
  if (!smooth) {
    scrollAnimationId += 1;
    window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
    return true;
  }

  // ~3/4 of previous speed ⇒ duration × 4/3
  const duration = Math.min(1467, Math.max(600, Math.abs(distance) * 0.733));
  const animationId = ++scrollAnimationId;
  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (animationId !== scrollAnimationId) return;
    if (startTime === null) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Explicit "auto" so CSS scroll-behavior cannot re-smooth each frame.
    window.scrollTo({
      top: startY + distance * easeOutCubic(progress),
      left: 0,
      behavior: "auto",
    });

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
  return true;
}

/**
 * Scrolls to a section once it becomes available after navigation.
 *
 * @param hash - The section hash to scroll to
 * @param updateHistory - Whether to update the browser history with the hash
 * @param smooth - When true, eases to the section; when false, jumps instantly
 */
function scrollWhenReady(hash: string, updateHistory = true, smooth = true) {
  const requestId = ++scrollWhenReadyId;

  const attempt = (attempts: number) => {
    if (requestId !== scrollWhenReadyId) return;
    if (scrollToSection(hash, updateHistory, smooth)) return;
    if (attempts >= 40) return;
    window.requestAnimationFrame(() => attempt(attempts + 1));
  };

  attempt(0);
}

/**
 * Renders a fixed header and accessible slide-out navigation menu for site and section navigation.
 */
export function Nav() {
  const { t } = useLocale();
  const { setMenuOpen } = useMenuModality();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [whatsBestOpen, setWhatsBestOpen] = useState(false);
  const menuId = useId();
  const submenuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingHashRef = useRef<string | null>(null);

  const closeMenu = () => {
    setOpen(false);
    setWhatsBestOpen(false);
  };

  useEffect(() => {
    setMenuOpen(open);
  }, [open, setMenuOpen]);

  useEffect(() => {
    return () => setMenuOpen(false);
  }, [setMenuOpen]);

  const goToHash = (hash: string) => {
    const normalized = hash.startsWith("#") ? hash : `#${hash}`;
    closeMenu();
    if (pathname === "/") {
      // Already on home — glide to the section.
      scrollWhenReady(normalized, true, true);
      return;
    }
    // App Router can drop hashes on client navigations; keep intent in a ref.
    // Arrival from another page teleports (no glide).
    pendingHashRef.current = normalized;
    router.push("/", { scroll: false });
  };

  useEffect(() => {
    if (pathname !== "/") return;

    const pending = pendingHashRef.current;
    if (pending) {
      pendingHashRef.current = null;
      scrollWhenReady(pending, true, false);
    } else if (window.location.hash) {
      // Direct load or restore with a hash — teleport into place.
      scrollWhenReady(window.location.hash, false, false);
    }

    const scrollFromLocation = () => {
      if (pathname !== "/") return;
      const { hash } = window.location;
      if (!hash) return;
      // Same-document hash/popstate — glide.
      scrollWhenReady(hash, false, true);
    };

    window.addEventListener("hashchange", scrollFromLocation);
    window.addEventListener("popstate", scrollFromLocation);
    return () => {
      cancelPendingScrolls();
      window.removeEventListener("hashchange", scrollFromLocation);
      window.removeEventListener("popstate", scrollFromLocation);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const getFocusable = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
          ).filter(
            (el) =>
              !el.hasAttribute("disabled") &&
              el.tabIndex !== -1 &&
              !el.closest("[hidden]"),
          )
        : [];

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    // Initial focus only when the drawer opens — not when the submenu toggles.
    const focusable = getFocusable();
    (focusable[0] ?? panel)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onHashClick = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault();
    goToHash(hash);
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
    }
  };

  const linkClass =
    "block w-full py-2.5 text-left font-[family-name:var(--font-body),var(--font-cyrillic)] text-base font-medium tracking-wide text-charcoal/85 transition-colors hover:text-blush-deep";

  return (
    <>
      <header
        dir="ltr"
        className="fixed inset-x-0 top-0 z-[60] h-[var(--nav-height)] border-b border-charcoal/10 bg-surface backdrop-blur-md"
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            ref={triggerRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-charcoal/80 transition-colors hover:text-blush-deep"
            aria-label={open ? t("nav.closeMenuAria") : t("nav.openMenuAria")}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span
                className={`h-px w-full bg-current transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-full bg-current transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>

          <Link
            href="/#home"
            className={`shrink-0 ${open ? "pointer-events-none" : ""}`}
            aria-label={t("nav.homeAria")}
            aria-hidden={open}
            tabIndex={open ? -1 : undefined}
            onClick={(event) => onHashClick(event, "#home")}
          >
            <Image
              src="/logo.svg"
              alt=""
              width={140}
              height={42}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[55] ${open ? "visible" : "invisible"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-charcoal/25 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
          aria-label={t("nav.closeMenuAria")}
          tabIndex={-1}
          onClick={closeMenu}
        />

        <div
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menuAria")}
          tabIndex={-1}
          onKeyDown={onPanelKeyDown}
          className={`absolute inset-y-0 left-0 flex h-dvh w-[min(22rem,88vw)] flex-col border-r border-charcoal/10 bg-[rgb(255,252,249)] transition-transform duration-200 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <nav
            aria-label={t("nav.primaryAria")}
            className="flex min-h-0 flex-1 flex-col justify-start px-7 pt-[calc(var(--nav-height)+1.5rem)] pb-10"
          >
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/#home"
                  className={linkClass}
                  onClick={(event) => onHashClick(event, "#home")}
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#artwork"
                  className={linkClass}
                  onClick={(event) => onHashClick(event, "#artwork")}
                >
                  {t("nav.artwork")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className={linkClass} onClick={closeMenu}>
                  {t("nav.shopAll")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`${linkClass} flex items-center justify-between gap-3`}
                  aria-expanded={whatsBestOpen}
                  aria-controls={submenuId}
                  onClick={() => setWhatsBestOpen((value) => !value)}
                >
                  <span>{t("nav.whatsBest")}</span>
                  <span
                    aria-hidden="true"
                    className={`text-charcoal/45 transition-transform ${whatsBestOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                <ul
                  id={submenuId}
                  hidden={!whatsBestOpen}
                  className="ml-3 border-l border-charcoal/10 pl-3"
                >
                  {SHOP_CATEGORIES.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={shopCategoryHref(category.id)}
                        className="block py-2 font-[family-name:var(--font-body),var(--font-cyrillic)] text-sm font-medium tracking-wide text-charcoal/70 transition-colors hover:text-blush-deep"
                        onClick={closeMenu}
                      >
                        {t(category.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  {t("nav.accessories")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className={linkClass}
                  onClick={(event) => onHashClick(event, "#contact")}
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
