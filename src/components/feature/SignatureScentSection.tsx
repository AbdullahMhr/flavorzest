"use client";

import { useProducts } from "@/lib/context/ProductContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function SignatureScentSection() {
    const { getSignatureScent } = useProducts();
    const product = getSignatureScent();

    if (!product || product.isHidden) return null;

    const variant100ml = product.variants?.find(v => v.size.toLowerCase() === '100ml');
    const displayPrice = variant100ml ? variant100ml.price : product.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
            <div className="relative aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden group w-full max-w-sm mx-auto lg:max-w-md">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="space-y-6">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Signature Scent
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{product.name}</h2>
                <p className="text-lg text-muted-foreground">
                    {product.description}
                </p>

                {product.notes && (
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                            Top Notes: {product.notes.top}
                        </li>
                        <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                            Heart Notes: {product.notes.heart}
                        </li>
                        <li className="flex items-center">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                            Base Notes: {product.notes.base}
                        </li>
                    </ul>
                )}

                <div className="flex gap-4">
                    <div className="text-2xl font-medium text-primary lkr-price">
                        LKR {displayPrice.toLocaleString()}
                    </div>
                </div>

                <Button size="lg" className="mt-4">
                    <Link href={`/product?id=${product.id}`}>Shop Now</Link>
                </Button>
            </div>
        </motion.div>
    );
}
