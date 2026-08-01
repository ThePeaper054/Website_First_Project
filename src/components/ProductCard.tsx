import Image from "next/image";
import { formatProductPrice, type Product } from "@/lib/products";

const DEFAULT_SIZES = "(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 28vw";

type ProductCardProps = {
  product: Product;
  /** Responsive `sizes` for the product image; defaults suit the home rail. */
  sizes?: string;
  /** Heading level for the product name; defaults to `3` under section titles. */
  headingLevel?: 2 | 3;
};

/**
 * Square product tile with image, name, and price.
 */
export function ProductCard({
  product,
  sizes = DEFAULT_SIZES,
  headingLevel = 3,
}: ProductCardProps) {
  const HeadingTag = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="flex w-full flex-col gap-2.5">
      <div className="relative aspect-square w-full overflow-hidden bg-blush/35">
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <HeadingTag className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-base font-medium tracking-wide text-charcoal sm:text-lg">
          {product.name}
        </HeadingTag>
        <p className="font-[family-name:var(--font-body),var(--font-arabic),var(--font-cyrillic)] text-sm text-charcoal/70">
          {formatProductPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
