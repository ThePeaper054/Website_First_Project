import { HomeSections } from "@/components/HomeSections";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Nav } from "@/components/Nav";

/**
 * Home page shell: server-rendered composition of client islands.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <HomeSections />
      <LanguageSwitcher />
    </>
  );
}
