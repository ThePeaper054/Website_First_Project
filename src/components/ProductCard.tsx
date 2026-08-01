import Image from "next/image";
import { formatProductPrice, type Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

/**
 * Square product tile with image, name, and price for the artwork scroller.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex w-full flex-col gap-2.5">
      <div className="relative aspect-square w-full overflow-hidden bg-blush/35">
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 28vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-base font-medium tracking-wide text-charcoal sm:text-lg">
          {product.name}
        </h3>
        <p className="font-[family-name:var(--font-body),var(--font-arabic),var(--font-cyrillic)] text-sm text-charcoal/70">
          {formatProductPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
