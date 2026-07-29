import { Nav } from "@/components/Nav";

const sections = [
  { id: "home", label: "Home" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-wide text-charcoal/45 sm:text-4xl">
              {section.label}
            </p>
          </section>
        ))}
      </main>
    </>
  );
}
