import Image from "next/image";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] border-b border-charcoal/10 bg-surface backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <nav aria-label="Primary" className="min-w-0 flex-1">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-[family-name:var(--font-body)] text-sm font-medium tracking-wide text-charcoal/80 transition-colors hover:text-blush-deep sm:text-[0.95rem]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#home" className="shrink-0" aria-label="Nail Studio home">
          <Image
            src="/logo.svg"
            alt="Nail Studio"
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
