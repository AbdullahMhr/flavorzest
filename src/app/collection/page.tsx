import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import CollectionClient from "./CollectionClient";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

export const metadata = {
    title: "Our Collection | FlavorZest",
    description: "Explore our full range of exclusive fragrances, each crafted to tell a unique story.",
    openGraph: {
        title: "Our Collection | FlavorZest",
        description: "Explore our full range of exclusive fragrances, each crafted to tell a unique story.",
    },
};

export default async function CollectionPage() {
    const { data: dbProducts } = await supabase
        .from("products")
        .select("*, variants:product_variants(*)")
        .order("order", { ascending: true });

    const formattedProducts: Product[] = (dbProducts || []).map((row: any) => ({
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

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <CollectionClient initialProducts={formattedProducts} />
            </main>
            <Footer />
        </div>
    );
}
