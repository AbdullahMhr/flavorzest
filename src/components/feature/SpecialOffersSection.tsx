"use client";

import { useProducts } from "@/lib/context/ProductContext";
import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { ArrowRight, Percent } from "lucide-react";
import { motion } from "framer-motion";

export function SpecialOffersSection() {
    const { products } = useProducts();

    const discountedProducts = products
        .filter(p => {
            if (!p.discount || p.discount <= 0 || p.isHidden) return false;
            if (!p.discountEndDate) return true;
            return new Date() <= new Date(p.discountEndDate);
        })
        .slice(0, 4); // Display up to 4 offers

    if (discountedProducts.length === 0) return null;

    return (
        <section className="py-20 bg-background relative overflow-hidden border-b border-border/40">
            <div className="absolute inset-0 bg-red-950/5 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <div className="flexitems-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-4">
                            <Percent className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Special Offers</h2>
                            <p className="text-muted-foreground">Limited time luxury at exclusive prices.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {discountedProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image || ""}
                                category={product.category}
                                variants={product.variants}
                                discount={product.discount}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
