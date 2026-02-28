"use client";

import { useProducts } from "@/lib/context/ProductContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";

function ProductContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { products } = useProducts();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [currentQuantity, setCurrentQuantity] = useState<number>(0);
    const [productFound, setProductFound] = useState(false);
    const [addToCartFeedback, setAddToCartFeedback] = useState(false);

    // Find product
    const product = products.find(p => p.id === id && !p.isHidden);

    useEffect(() => {
        if (product) {
            setProductFound(true);
            if (products.length > 0 && !selectedSize) {
                if (product.variants && product.variants.length > 0) {
                    // Default to first in-stock variant, or first variant if all out of stock
                    const inStockVariant = product.variants.find(v => v.quantity > 0);
                    const defaultVariant = inStockVariant || product.variants[0];
                    setSelectedSize(defaultVariant.size);
                    setCurrentPrice(defaultVariant.price);
                    setCurrentQuantity(defaultVariant.quantity);
                } else {
                    setCurrentPrice(product.price);
                    // Legacy products without variants might not have quantity tracked, assume 0 or 1 for safety, let's say 1
                    setCurrentQuantity(1);
                }
            }
        }
    }, [product, products, selectedSize]);

    if (!id) {
        return <div className="min-h-screen flex items-center justify-center">No Product ID specified.</div>;
    }

    if (!product && products.length > 0) {
        return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
    }

    if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        const variant = product.variants?.find(v => v.size === size);
        if (variant) {
            setCurrentPrice(variant.price);
            setCurrentQuantity(variant.quantity);
        }
    };

    const isDiscountValid = () => {
        if (!product.discount || product.discount <= 0) return false;
        if (!product.discountEndDate) return true;
        return new Date() <= new Date(product.discountEndDate);
    };

    const isDiscounted = isDiscountValid();

    const handleAddToCart = () => {
        const activePrice = isDiscounted && product.discount
            ? Math.floor(currentPrice * ((100 - product.discount) / 100))
            : currentPrice;

        addToCart({
            productId: product.id,
            name: product.name,
            price: activePrice,
            image: product.image || "",
            size: selectedSize || "Standard"
        });

        setAddToCartFeedback(true);
        setTimeout(() => setAddToCartFeedback(false), 3000);
    };

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Product Image - Resized as requested */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full max-w-md mx-auto aspect-square rounded-xl overflow-hidden bg-muted border shadow-lg"
                >
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8"
                >
                    <div>
                        {isDiscounted && product.discount && (
                            <div className="mb-3 inline-block bg-red-600 text-white text-[10px] md:text-sm font-bold px-3 py-1.5 rounded-full shadow-md tracking-wider">
                                {product.discount}% OFF {product.discountEndDate ? `UNTIL ${new Date(product.discountEndDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}` : ''}
                            </div>
                        )}
                        <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">{product.category} • {product.origin || "Unknown Origin"}</p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{product.name}</h1>

                        <div className="mt-4 flex flex-col justify-end min-h-[3rem]">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={currentPrice}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="flex items-baseline gap-3"
                                >
                                    {isDiscounted && product.discount ? (
                                        <>
                                            <span className="text-3xl font-bold text-primary">
                                                LKR {Math.floor(currentPrice * ((100 - product.discount) / 100)).toLocaleString()}
                                            </span>
                                            <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                                                LKR {currentPrice.toLocaleString()}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-medium text-primary">
                                            LKR {currentPrice.toLocaleString()}
                                        </span>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    {/* Size Selector */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Select Size</label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant) => {
                                    const isOutOfStock = variant.quantity === 0;
                                    return (
                                        <button
                                            key={variant.size}
                                            disabled={isOutOfStock}
                                            onClick={() => handleSizeSelect(variant.size)}
                                            className={cn(
                                                "px-4 py-2 border rounded-full text-sm font-medium transition-all duration-200 relative",
                                                selectedSize === variant.size
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                                    : "bg-background text-foreground hover:border-primary/50",
                                                isOutOfStock && "opacity-50 cursor-not-allowed hover:border-border bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {variant.size}
                                            {isOutOfStock && (
                                                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                                                    Sold Out
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {currentQuantity > 0 ? (
                                <p className="text-sm text-green-600 font-medium mt-2">{currentQuantity} available in stock</p>
                            ) : (
                                <p className="text-sm text-destructive font-medium mt-2">Currently out of stock</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-4 pt-6 border-t">
                        <h3 className="font-semibold text-foreground">Olfactory Notes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <span className="block font-medium text-primary mb-1">Top Notes</span>
                                <span className="text-muted-foreground">{product.notes.top}</span>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <span className="block font-medium text-primary mb-1">Heart Notes</span>
                                <span className="text-muted-foreground">{product.notes.heart}</span>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <span className="block font-medium text-primary mb-1">Base Notes</span>
                                <span className="text-muted-foreground">{product.notes.base}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-6">
                        <Button
                            size="lg"
                            className="w-full text-lg h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                            disabled={currentQuantity === 0}
                        >
                            {currentQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        <AnimatePresence>
                            {addToCartFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center text-sm font-medium text-green-600 bg-green-50 py-2 rounded-md"
                                >
                                    Successfully added to your cart!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ProductPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12 lg:py-20">
                <Suspense fallback={<div className="container mx-auto px-4 text-center">Loading...</div>}>
                    <ProductContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
