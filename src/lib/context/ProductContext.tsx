"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductVariant } from "../types";
import { PRODUCTS as INITIAL_PRODUCTS } from "../data";

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getSignatureScent: () => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("flavorzest_products");
        if (saved) {
            try {
                setProducts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse products from local storage", e);
                setProducts(INITIAL_PRODUCTS);
            }
        } else {
            setProducts(INITIAL_PRODUCTS);
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever products change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("flavorzest_products", JSON.stringify(products));
        }
    }, [products, isInitialized]);

    const addProduct = (product: Product) => {
        setProducts((prev) => [...prev, product]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    // If setting signature, unset others
                    if (updates.isSignature) {
                        // handle in a separate effect or just loop here? 
                        // Context state updates are batched, so we might need a better strategy if we want to ensure only one signature exists.
                        // But for now, we can iterate.
                    }
                    return { ...p, ...updates };
                }
                // If we are setting a new signature scent, ensure others are false
                if (updates.isSignature && p.isSignature) {
                    return { ...p, isSignature: false };
                }
                return p;
            })
        );
    };

    const deleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const getSignatureScent = () => {
        return products.find((p) => p.isSignature);
    };

    // Prevent hydration mismatch by optionally not rendering children until initialized? 
    // Or just render defaults. Since we're using 'use client', layout effect runs after hydration.
    // We'll return children always, but maybe with initial state.

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getSignatureScent }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
