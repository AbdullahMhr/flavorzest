export interface ProductVariant {
    size: string;
    price: number;
    quantity: number; // Added for inventory tracking
}

export interface Product {
    id: string;
    name: string;
    price: number; // Base price (usually smallest or default size)
    description: string;
    image: string;
    category: string;
    gender: "Men" | "Women" | "Unisex";
    notes: {
        top: string;
        heart: string;
        base: string;
    };
    variants: ProductVariant[];
    origin: string;
    isSignature: boolean;
    order?: number;
    isHidden?: boolean;
    discount?: number;
    discountEndDate?: string;
}
