"use client";

import { useProducts } from "@/lib/context/ProductContext";
import { ProductCard } from "@/components/feature/ProductCard";

export function FeaturedProductsSection() {
    const { products } = useProducts();
    // Safely slice the first 3 products
    const featuredProducts = products.slice(0, 3);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </div>
    );
}
