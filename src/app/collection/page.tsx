"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/feature/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useProducts } from "@/lib/context/ProductContext"; // Import Context

import { motion } from "framer-motion";

function CollectionContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const { products } = useProducts(); // Use products from Context

    const filteredProducts = products.filter((product) => {
        const matchesCategory = category ? product.category.toLowerCase() === category.toLowerCase() : true;
        const matchesSearch = search
            ? product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        {category ? `${category} Collection` : "Signature Collection"}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {search ? `Showing results for "${search}"` : "Explore our full range of exclusive fragrances, each crafted to tell a unique story."}
                    </p>
                </motion.div>
            </div>

            {filteredProducts.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {filteredProducts.map((product) => (
                        <motion.div key={product.id} variants={item}>
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">No fragrances found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}

export default function CollectionPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <Suspense fallback={<div className="container mx-auto px-4 text-center">Loading collection...</div>}>
                    <CollectionContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
