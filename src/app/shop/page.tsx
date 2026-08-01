import { ShopLoading } from "@/components/ShopLoading";
import { ShopPage } from "@/components/ShopPage";
import { Suspense } from "react";

/**
 * Renders the shop page with a loading state while its content is unavailable.
 *
 * @returns The shop page or its loading fallback
 */
export default function Shop() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopPage />
    </Suspense>
  );
}
