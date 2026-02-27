"use client";

import { useProducts } from "@/lib/context/ProductContext";
import { ProductCard } from "@/components/feature/ProductCard";

export function FeaturedProductsSection() {
    const { products } = useProducts();
    // Safely slice the first 3 visible products
    const featuredProducts = products.filter(p => !p.isHidden).slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto gap-8 lg:gap-12 justify-items-center">
            {featuredProducts.map((product) => (
                <div key={product.id} className="max-w-[360px] w-full">
                    <ProductCard {...product} />
                </div>
            ))}
        </div>
    );
}
