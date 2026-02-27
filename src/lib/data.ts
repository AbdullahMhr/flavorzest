import { Product } from "./types";

export const PRODUCTS: Product[] = [
    {
        id: "1",
        name: "The Midnight Oud",
        price: 38500.00,
        description: "A mysterious and captivating fragrance that blends the richness of agarwood with the warmth of spices. The Midnight Oud is an olfactory journey into the heart of the night, where secrets are whispered and elegance reigns supreme.",
        image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=800&auto=format&fit=crop",
        category: "Unisex",
        gender: "Unisex",
        notes: {
            top: "Bergamot, Saffron",
            heart: "Rose, Oud Wood",
            base: "Amber, Musk, Patchouli"
        },
        variants: [
            { size: "5ml", price: 4500, quantity: 50 },
            { size: "10ml", price: 8500, quantity: 50 },
            { size: "100ml", price: 38500, quantity: 20 }
        ],
        origin: "Dubai, UAE",
        isSignature: true
    },
    {
        id: "2",
        name: "Aurum Elixir",
        price: 42000.00,
        description: "A radiant blend of golden amber and white florals, embodying elegance and grace. Aurum Elixir captures the essence of pure gold, delivering a luminous scent that lingers like a precious memory.",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
        category: "Women",
        gender: "Women",
        notes: {
            top: "Pear, Neroli",
            heart: "Jasmine, Orange Blossom",
            base: "Vanilla, Precious Woods"
        },
        variants: [
            { size: "5ml", price: 5000, quantity: 50 },
            { size: "10ml", price: 9500, quantity: 50 },
            { size: "100ml", price: 42000, quantity: 15 }
        ],
        origin: "Grasse, France",
        isSignature: false
    },
    {
        id: "3",
        name: "Noir Intense",
        price: 34500.00,
        description: "A bold and sophisticated scent for the modern man, featuring dark spices and leather. Noir Intense is a statement of power and confidence, designed for those who command attention without saying a word.",
        image: "https://images.unsplash.com/photo-1523293188086-b589b9e54020?q=80&w=800&auto=format&fit=crop",
        category: "Men",
        gender: "Men",
        notes: {
            top: "Black Pepper, Cardamom",
            heart: "Leather, Tobacco",
            base: "Vetiver, Tonka Bean"
        },
        variants: [
            { size: "5ml", price: 4000, quantity: 50 },
            { size: "10ml", price: 7500, quantity: 50 },
            { size: "100ml", price: 34500, quantity: 25 }
        ],
        origin: "London, UK",
        isSignature: false
    },
    {
        id: "4",
        name: "Rose Royale",
        price: 39900.00,
        description: "A tribute to the queen of flowers, this scent pairs velvety rose with a hint of citrus. Rose Royale is a romantic and regal fragrance that celebrates femininity in its most exquisite form.",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
        category: "Women",
        gender: "Women",
        notes: {
            top: "Mandarin, Lychee",
            heart: "Damask Rose, Peony",
            base: "White Musk, Cedar"
        },
        variants: [
            { size: "5ml", price: 4800, quantity: 50 },
            { size: "10ml", price: 8800, quantity: 50 },
            { size: "100ml", price: 39900, quantity: 18 }
        ],
        origin: "Paris, France",
        isSignature: false
    },
    {
        id: "5",
        name: "Oceanic Breeze",
        price: 28500.00,
        description: "Fresh and invigorating, capturing the spirit of the sea with marine notes and citrus. Oceanic Breeze brings the freedom of the open ocean to your daily life, perfect for the adventurous spirit.",
        image: "https://images.unsplash.com/photo-1583445013765-46c20c4a6772?q=80&w=800&auto=format&fit=crop",
        category: "Unisex",
        gender: "Unisex",
        notes: {
            top: "Sea Salt, Lemon",
            heart: "Sage, Seaweed",
            base: "Driftwood, Ambergris"
        },
        variants: [
            { size: "5ml", price: 3500, quantity: 50 },
            { size: "10ml", price: 6500, quantity: 50 },
            { size: "100ml", price: 28500, quantity: 30 }
        ],
        origin: "Amalfi, Italy",
        isSignature: false
    },
    {
        id: "6",
        name: "Spiced Leather",
        price: 32000.00,
        description: "Warm and masculine, blending rich leather with exotic spices for a powerful statement. Spiced Leather is a classic scent reimagined for the contemporary gentleman who appreciates tradition and quality.",
        image: "https://images.unsplash.com/photo-1615160359797-a84accd09ae8?q=80&w=800&auto=format&fit=crop",
        category: "Men",
        gender: "Men",
        notes: {
            top: "Cinnamon, Clove",
            heart: "Leather, Iris",
            base: "Sandalwood, Vanilla"
        },
        variants: [
            { size: "5ml", price: 3800, quantity: 50 },
            { size: "10ml", price: 7200, quantity: 50 },
            { size: "100ml", price: 32000, quantity: 20 }
        ],
        origin: "New York, USA",
        isSignature: false
    }
];
