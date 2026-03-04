import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ProductClient from "./ProductClient";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const id = resolvedParams.id as string;

    if (!id) {
        return {
            title: "Product Not Found | FlavorZest",
            description: "The requested fragrance could not be found."
        };
    }

    const { data } = await supabase
        .from("products")
        .select("name, description, image")
        .eq("id", id)
        .single();

    if (!data) {
        return {
            title: "Product Not Found | FlavorZest",
            description: "The requested fragrance could not be found."
        };
    }

    return {
        title: `${data.name} | FlavorZest`,
        description: data.description,
        openGraph: {
            title: `${data.name} | FlavorZest`,
            description: data.description,
            images: [data.image],
        },
    };
}

export default async function ProductPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const id = resolvedParams.id as string;

    let formattedProduct: Product | undefined = undefined;

    if (id) {
        const { data: dbProduct } = await supabase
            .from("products")
            .select("*, variants:product_variants(*)")
            .eq("id", id)
            .single();

        if (dbProduct) {
            formattedProduct = {
                id: dbProduct.id,
                name: dbProduct.name,
                price: Number(dbProduct.price),
                description: dbProduct.description,
                image: dbProduct.image,
                category: dbProduct.category,
                gender: dbProduct.gender,
                notes: typeof dbProduct.notes === "string" ? JSON.parse(dbProduct.notes) : dbProduct.notes,
                variants: dbProduct.variants.map((v: any) => ({
                    id: v.id,
                    size: v.size,
                    price: Number(v.price),
                    quantity: Number(v.quantity)
                })),
                origin: dbProduct.origin,
                isSignature: dbProduct.isSignature,
                order: Number(dbProduct.order),
                isHidden: dbProduct.isHidden,
                discount: dbProduct.discount ? Number(dbProduct.discount) : undefined,
                discountEndDate: dbProduct.discount_end_date || undefined
            };
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12 lg:py-20">
                <ProductClient initialProduct={formattedProduct} />
            </main>
            <Footer />
        </div>
    );
}
