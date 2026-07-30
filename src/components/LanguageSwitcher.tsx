"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import Image from "next/image";
import { useId, useRef, useState } from "react";

/**
 * Fixed bottom-left language control: hover or click/tap reveals other flags;
 * choosing a flag sets the locale. Escape closes the menu.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** Hover opens before click; ignore the trailing click so it does not toggle closed. */
  const openedByHoverRef = useRef(false);
  const listId = useId();
  const current = localeMeta[locale];
  const others = locales.filter((id) => id !== locale);

  const show = () => setOpen(true);
  const hide = () => {
    openedByHoverRef.current = false;
    setOpen(false);
  };
  const hideUnlessFocused = () => {
    if (rootRef.current?.contains(document.activeElement)) return;
    hide();
  };

  const closeAndFocusTrigger = () => {
    hide();
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      dir="ltr"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1"
      onMouseEnter={() => {
        openedByHoverRef.current = true;
        show();
      }}
      onMouseLeave={hideUnlessFocused}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          hide();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          closeAndFocusTrigger();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t("lang.switcherAria")}: ${current.nativeName}`}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-surface/95 px-1.5 py-1 leading-none text-charcoal shadow-sm ring-1 ring-charcoal/10 backdrop-blur-md transition-colors hover:text-blush-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep"
        onClick={() => {
          if (openedByHoverRef.current) {
            openedByHoverRef.current = false;
            show();
            return;
          }
          setOpen((value) => !value);
        }}
      >
        <FlagIcon src={current.flagSrc} alt="" />
        <span
          aria-hidden="true"
          className={`inline-block text-[0.65rem] text-charcoal/60 transition-transform ${open ? "translate-x-0.5" : ""}`}
        >
          ▸
        </span>
      </button>

      <ul
        id={listId}
        role="menu"
        aria-label={t("lang.switcherAria")}
        aria-hidden={!open}
        className={`flex items-center gap-1 transition-[opacity,transform,visibility] duration-150 ${
          open
            ? "visible translate-x-0 opacity-100"
            : "invisible pointer-events-none -translate-x-1 opacity-0"
        }`}
      >
        {others.map((id) => (
          <LocaleOption
            key={id}
            id={id}
            open={open}
            onSelect={(next) => {
              setLocale(next);
              hide();
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function FlagIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={22}
      height={15}
      className="h-[15px] w-[22px] rounded-[2px] object-cover ring-1 ring-charcoal/15"
      unoptimized
    />
  );
}

function LocaleOption({
  id,
  open,
  onSelect,
}: {
  id: Locale;
  open: boolean;
  onSelect: (locale: Locale) => void;
}) {
  const meta = localeMeta[id];

  return (
    <li role="none" className="shrink-0">
      <button
        type="button"
        role="menuitem"
        tabIndex={open ? 0 : -1}
        aria-label={meta.nativeName}
        className="rounded-md bg-surface/95 px-1.5 py-1 leading-none shadow-sm ring-1 ring-charcoal/10 backdrop-blur-md transition-colors hover:bg-blush/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep"
        onClick={() => onSelect(id)}
      >
        <FlagIcon src={meta.flagSrc} alt="" />
      </button>
    </li>
  );
}
