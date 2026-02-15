"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

import { ProductVariant } from "@/lib/types";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    variants?: ProductVariant[];
}

export function ProductCard({ id, name, price, image, category, variants }: ProductCardProps) {
    const displayPrice = variants && variants.length > 0
        ? Math.min(...variants.map(v => v.price))
        : price;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-xl hover:border-primary/50"
        >
            <div className="aspect-square relative overflow-hidden bg-muted">
                {/* Placeholder image logic since we might not have real images yet */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20">
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
            </div>
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{category}</p>
                        <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                            <Link href={`/product?id=${id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {name}
                            </Link>
                        </h3>
                    </div>
                    <p className="font-medium text-primary">
                        {variants && variants.length > 0 ? "From " : ""}
                        LKR {displayPrice.toLocaleString()}
                    </p>
                </div>
                <Button asChild className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground z-10 relative opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Link href={`/product?id=${id}`}>View Details</Link>
                </Button>
            </div>
        </motion.div>
    );
}
