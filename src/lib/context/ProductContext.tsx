"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, ProductVariant } from "../types";
import { supabase } from "../supabase";

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getSignatureScent: () => Product | undefined;
    reorderProduct: (id: string, direction: 'up' | 'down') => Promise<void>;
    updateProductsOrder: (newOrderedProducts: Product[]) => Promise<void>;
    isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data: dbProducts, error: pErr } = await supabase
            .from("products")
            .select("*, variants:product_variants(*)")
            .order("order", { ascending: true });

        if (pErr) {
            console.error("Error fetching products:", pErr);
            setIsLoading(false);
            return;
        }

        const formattedProducts: Product[] = dbProducts.map((row: any) => ({
            id: row.id,
            name: row.name,
            price: Number(row.price),
            description: row.description,
            image: row.image,
            category: row.category,
            gender: row.gender,
            notes: typeof row.notes === "string" ? JSON.parse(row.notes) : row.notes,
            variants: row.variants.map((v: any) => ({
                id: v.id,
                size: v.size,
                price: Number(v.price),
                quantity: Number(v.quantity)
            })),
            origin: row.origin,
            isSignature: row.isSignature,
            order: Number(row.order),
            isHidden: row.isHidden,
            discount: row.discount ? Number(row.discount) : undefined,
            discountEndDate: row.discount_end_date || undefined
        }));

        setProducts(formattedProducts);
        setIsLoading(false);
    };

    // Load from Supabase on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (product: Omit<Product, 'id'>) => {
        // Strip out variants and pseudo-id from base insertion
        const { id, variants, discountEndDate, ...productData } = product as any;

        const dbPayload = {
            ...productData,
            discount_end_date: discountEndDate || null
        };

        const { data, error } = await supabase
            .from("products")
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error("Error adding product:", error);
            return;
        }

        const newProductId = data.id;

        if (variants && variants.length > 0) {
            const variantsData = variants.map((v: any) => ({
                product_id: newProductId,
                size: v.size,
                price: v.price,
                quantity: v.quantity
            }));
            const { error: vError } = await supabase.from("product_variants").insert(variantsData);
            if (vError) console.error("Error adding variants:", vError);
        }

        await fetchProducts();
    };

    const updateProduct = async (updateId: string, updates: Partial<Product>) => {
        const { variants, discountEndDate, id, ...productUpdates } = updates as any;

        // If setting signature, unset others in the cloud first
        if (productUpdates.isSignature) {
            await supabase.from("products").update({ isSignature: false }).eq("isSignature", true);
        }

        const dbUpdates: any = { ...productUpdates };
        if ('discountEndDate' in updates) {
            dbUpdates.discount_end_date = discountEndDate || null;
        }

        if (Object.keys(dbUpdates).length > 0) {
            const { error } = await supabase.from("products").update(dbUpdates).eq("id", updateId);
            if (error) {
                console.error("Error updating product:", error);
                alert("Database Update Failed: " + (error.message || JSON.stringify(error)));
            }
        }

        if (variants) {
            // Delete old variants and insert the fresh array to simplify sync
            await supabase.from("product_variants").delete().eq("product_id", updateId);

            const newVariants = variants.map((v: any) => ({
                product_id: updateId,
                size: v.size,
                price: v.price,
                quantity: v.quantity
            }));

            if (newVariants.length > 0) {
                await supabase.from("product_variants").insert(newVariants);
            }
        }

        await fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        // 1. Fetch the product first to get the image URL so we can delete the physical file
        const { data: productToDelete } = await supabase.from("products").select("image").eq("id", id).single();

        if (productToDelete?.image) {
            try {
                // Extract filename from the standard Supabase public URL structure
                // e.g. https://.../storage/v1/object/public/perfumes/1771903691472-abcd.webp
                const urlParts = productToDelete.image.split('/perfumes/');
                if (urlParts.length > 1) {
                    const fileName = urlParts[1].split('?')[0]; // Handle potential query params
                    const { error: storageError } = await supabase.storage.from("perfumes").remove([fileName]);
                    if (storageError) console.error("Warn: Failed to delete image from storage:", storageError);
                }
            } catch (err) {
                console.error("Warn: Image cleanup parser failed:", err);
            }
        }

        // 2. Delete the actual database row (variants cascade or are handled by FK constraints)
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            console.error("Error deleting product:", error);
            alert("Database Error: Failed to delete product row.");
        } else {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const getSignatureScent = () => {
        return products.find((p) => p.isSignature);
    };

    const reorderProduct = async (id: string, direction: 'up' | 'down') => {
        const sorted = [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const currentIndex = sorted.findIndex(p => p.id === id);
        if (currentIndex === -1) return;

        let prevItem: Product | undefined;
        let currentItem = sorted[currentIndex];

        if (direction === 'up' && currentIndex > 0) {
            prevItem = sorted[currentIndex - 1];
        } else if (direction === 'down' && currentIndex < sorted.length - 1) {
            prevItem = sorted[currentIndex + 1];
        } else {
            return;
        }

        const tempOrder = prevItem.order;
        prevItem.order = currentItem.order;
        currentItem.order = tempOrder;

        await supabase.from("products").update({ order: currentItem.order }).eq("id", currentItem.id);
        await supabase.from("products").update({ order: prevItem.order }).eq("id", prevItem.id);

        await fetchProducts();
    };

    const updateProductsOrder = async (newOrderedProducts: Product[]) => {
        const updates = newOrderedProducts.map((p, index) => ({
            id: p.id,
            order: index
        }));

        // Execute sequential updates
        for (const update of updates) {
            await supabase.from("products").update({ order: update.order }).eq("id", update.id);
        }

        await fetchProducts();
    };

    const sortedProducts = [...products].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <ProductContext.Provider value={{
            products: sortedProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            getSignatureScent,
            reorderProduct,
            updateProductsOrder,
            isLoading
        }}>
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

