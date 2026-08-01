import { ShopLoading } from "@/components/ShopLoading";
import { ShopPage } from "@/components/ShopPage";
import { Suspense } from "react";

/**
 * Shop route — products and search/filter UI will be added later.
 */
export default function Shop() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopPage />
    </Suspense>
  );
}
