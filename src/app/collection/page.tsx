"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/feature/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useProducts } from "@/lib/context/ProductContext";

import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Filter, X, Search } from "lucide-react";
import DOMPurify from "dompurify";

function CollectionContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read from URL initially
    const urlCategory = searchParams.get("category");
    const urlGender = searchParams.get("gender");
    const urlSearch = searchParams.get("search");

    const { products } = useProducts();

    const [selectedGender, setSelectedGender] = useState<string>(
        urlGender
            ? urlGender.charAt(0).toUpperCase() + urlGender.slice(1).toLowerCase()
            : urlCategory
                ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1).toLowerCase()
                : "All"
    );
    const [selectedSize, setSelectedSize] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState(urlSearch || "");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const filteredProducts = products.filter((product) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = q
            ? product.name?.toLowerCase().includes(q) ||
            product.description?.toLowerCase().includes(q) ||
            product.notes?.top?.toLowerCase().includes(q) ||
            product.notes?.heart?.toLowerCase().includes(q) ||
            product.notes?.base?.toLowerCase().includes(q)
            : true;

        const normalizedGender = selectedGender.toLowerCase().trim();
        const matchesGender = selectedGender === "All" ||
            product.gender?.toLowerCase().trim() === normalizedGender ||
            product.category?.toLowerCase().trim() === normalizedGender;

        const normalizedSize = selectedSize.toLowerCase().replace(/\s/g, '');
        const matchesSize = selectedSize === "All" ||
            product.variants?.some(v => v.size?.toLowerCase().replace(/\s/g, '') === normalizedSize && (v.quantity === undefined || v.quantity > 0));

        console.log(`[FILTER] Product: ${product.name}, Gender: ${product.gender}/${product.category}, SizeMatch: ${matchesSize}, GenderMatch: ${matchesGender}`);

        return matchesSearch && matchesGender && matchesSize && !product.isHidden;
    });

    console.log(`[STATE] selectedGender: ${selectedGender}, selectedSize: ${selectedSize}, Results: ${filteredProducts.length}`);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Our Collections
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {urlSearch ? `Showing results for "${DOMPurify.sanitize(urlSearch)}"` : "Explore our full range of exclusive fragrances, each crafted to tell a unique story."}
                    </p>
                </motion.div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="md:hidden flex justify-between items-center mb-4">
                    <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="w-full flex items-center justify-center gap-2 border-primary/30">
                        <Filter className="h-4 w-4" /> {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                    </Button>
                </div>

                {/* Filters Sidebar */}
                <div
                    className={`w-full md:w-64 shrink-0 space-y-8 overflow-hidden md:overflow-visible transition-all duration-300 ${!isFiltersOpen ? 'hidden md:block' : 'block'}`}
                >
                    {/* Search */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Search</h3>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Search by name, note..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-primary/30 focus-visible:ring-primary/50"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Gender Filter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Gender</h3>
                        <div className="flex flex-col gap-2">
                            {["All", "Men", "Women", "Unisex"].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGender(g)}
                                    className={`text-left px-2 py-1 flex items-center gap-3 rounded transition-colors ${selectedGender === g ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-primary/10 text-muted-foreground'}`}
                                >
                                    <div className={`w-3 h-3 rounded-full border border-primary ${selectedGender === g ? 'bg-primary' : 'bg-transparent'}`} />
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {["All", "5ml", "10ml", "100ml"].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`px-3 py-1 text-sm rounded border transition-colors ${selectedSize === s ? 'border-primary bg-primary/20 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSelectedGender("All");
                            setSelectedSize("All");
                            setSearchQuery("");
                            router.push('/collection');
                        }}
                        className="w-full w-full border-primary/30 hover:bg-primary/10"
                    >
                        Clear All Filters
                    </Button>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {filteredProducts.map((product) => (
                                <motion.div key={product.id} variants={item}>
                                    <ProductCard {...product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 border rounded-lg border-dashed">
                            <p className="text-lg text-muted-foreground">No fragrances found matching your criteria.</p>
                            <Button variant="link" onClick={() => { setSelectedGender("All"); setSelectedSize("All"); setSearchQuery(""); router.push('/collection'); }} className="mt-2 text-primary">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default function CollectionPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <Suspense fallback={<div className="container mx-auto px-4 text-center">Loading collection...</div>}>
                    <CollectionContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
