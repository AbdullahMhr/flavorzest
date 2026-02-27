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
    discount?: number;
    discountEndDate?: string;
}

export function ProductCard({ id, name, price, image, category, variants, discount, discountEndDate }: ProductCardProps) {
    // Find 100ml variant price if available
    const variant100ml = variants?.find(v => v.size.toLowerCase() === '100ml');
    const basePrice = variant100ml ? variant100ml.price : price;

    // Calculate if discount is currently active
    const isDiscountValid = () => {
        if (!discount || discount <= 0) return false;
        if (!discountEndDate) return true;
        return new Date() <= new Date(discountEndDate);
    };

    const isDiscounted = isDiscountValid();
    const salePrice = isDiscounted ? Math.floor(basePrice * ((100 - (discount || 0)) / 100)) : basePrice;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-xl hover:border-primary/50"
        >
            <div className="aspect-square relative overflow-hidden bg-muted">
                {isDiscounted && (
                    <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded shadow-md tracking-wider">
                        {discount}% OFF {discountEndDate ? `UNTIL ${new Date(discountEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}` : ''}
                    </div>
                )}
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
                    <div className="text-right">
                        {isDiscounted ? (
                            <div className="flex flex-col items-end leading-tight">
                                <span className="font-bold text-primary">LKR {salePrice.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground line-through">LKR {basePrice.toLocaleString()}</span>
                            </div>
                        ) : (
                            <p className="font-medium text-primary">
                                LKR {basePrice.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
                <Button asChild className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground z-10 relative opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Link href={`/product?id=${id}`}>View Details</Link>
                </Button>
            </div>
        </motion.div>
    );
}
