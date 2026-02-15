"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { useProducts } from "./ProductContext";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    setIsCartOpen: (open: boolean) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("flavorzest_cart");
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("flavorzest_cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    const { products } = useProducts();

    const getStock = (productId: string, size: string) => {
        const product = products.find(p => p.id === productId);
        const variant = product?.variants?.find(v => v.size === size);
        return variant?.quantity || 0;
    };

    const addToCart = (newItem: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
            const existing = prev.find(
                (item) => item.productId === newItem.productId && item.size === newItem.size
            );

            const stock = getStock(newItem.productId, newItem.size);

            if (existing) {
                if (existing.quantity >= stock) {
                    alert(`Sorry, only ${stock} items available.`);
                    return prev;
                }
                return prev.map((item) =>
                    item.productId === newItem.productId && item.size === newItem.size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            if (stock < 1) {
                alert("Sorry, this item is out of stock.");
                return prev;
            }

            return [...prev, { ...newItem, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: string, size: string) => {
        setCart((prev) => prev.filter((item) => !(item.productId === productId && item.size === size)));
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity < 1) return;

        const stock = getStock(productId, size);
        if (quantity > stock) {
            alert(`Sorry, only ${stock} items available.`);
            return;
        }

        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId && item.size === size ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                isCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                setIsCartOpen,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
