"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import Image from "next/image";
import { useId, useState } from "react";

/**
 * Fixed bottom-left language control: always [current flag] ▸ ;
 * hover/focus reveals all flags in fixed slots to the right (order never changes).
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const current = localeMeta[locale];

  return (
    <div
      dir="ltr"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t("lang.switcherAria")}
        className="flex shrink-0 items-center gap-1 rounded-md bg-surface/95 px-1.5 py-1 leading-none text-charcoal shadow-sm ring-1 ring-charcoal/10 backdrop-blur-md transition-colors hover:text-blush-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep"
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
        role="listbox"
        aria-label={t("lang.switcherAria")}
        aria-hidden={!open}
        className={`flex items-center gap-1 transition-[opacity,transform,visibility] duration-150 ${
          open
            ? "visible translate-x-0 opacity-100"
            : "invisible pointer-events-none -translate-x-1 opacity-0"
        }`}
      >
        {locales.map((id) => (
          <LocaleOption
            key={id}
            id={id}
            open={open}
            selected={id === locale}
            onSelect={setLocale}
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
  selected,
  onSelect,
}: {
  id: Locale;
  open: boolean;
  selected: boolean;
  onSelect: (locale: Locale) => void;
}) {
  const meta = localeMeta[id];

  return (
    <li role="option" aria-selected={selected} className="shrink-0">
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label={meta.nativeName}
        className={`rounded-md bg-surface/95 px-1.5 py-1 leading-none shadow-sm ring-1 backdrop-blur-md transition-colors hover:bg-blush/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep ${
          selected
            ? "ring-blush-deep"
            : "ring-charcoal/10 opacity-80 hover:opacity-100"
        }`}
        onClick={() => onSelect(id)}
      >
        <FlagIcon src={meta.flagSrc} alt="" />
      </button>
    </li>
  );
}
