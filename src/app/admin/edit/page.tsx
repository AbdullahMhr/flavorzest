"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProducts } from "@/lib/context/ProductContext";
import { Product, ProductVariant } from "@/lib/types";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { compressAndUploadImage } from "@/lib/imageUtils";
import { useAuth } from "@/lib/context/AuthContext";

function EditProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { products, updateProduct } = useProducts();
    const { isAuthenticated, isInitializing } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [productLoaded, setProductLoaded] = useState(false);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        description: "",
        price: 0,
        category: "Eau de Parfum",
        gender: "Unisex",
        image: "",
        origin: "",
        isSignature: false,
        notes: { top: "", heart: "", base: "" },
        variants: []
    });

    // Auth check & Load Product
    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            router.push("/admin");
            return;
        }

        if (!id) {
            // If no ID, maybe redirect?
            return;
        }

        // Find product
        const product = products.find(p => p.id === id);
        if (product) {
            setFormData(JSON.parse(JSON.stringify(product))); // Deep copy
            setProductLoaded(true);
        }
    }, [products, id, router]);

    const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
        const newVariants = [...(formData.variants || [])];
        const finalValue = (field === 'price' || field === 'quantity')
            ? Math.max(0, typeof value === 'string' ? parseFloat(value) || 0 : value)
            : value;
        newVariants[index] = { ...newVariants[index], [field]: finalValue };
        setFormData({ ...formData, variants: newVariants });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...(formData.variants || []), { size: "", price: 0, quantity: 0 }]
        });
    };

    const removeVariant = (index: number) => {
        const newVariants = [...(formData.variants || [])];
        newVariants.splice(index, 1);
        setFormData({ ...formData, variants: newVariants });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);

        const updatedProduct = {
            ...formData,
            price: formData.variants && formData.variants.length > 0 ? Math.min(...formData.variants.map(v => v.price)) : (formData.price || 0)
        };

        await updateProduct(id, updatedProduct);
        setLoading(false);
        router.push("/admin/dashboard");
    };

    if (isInitializing) {
        return <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (!isAuthenticated) return null;

    if (!id) {
        return <div className="min-h-screen flex items-center justify-center">No Product ID specified.</div>;
    }

    if (!productLoaded && products.length > 0) {
        return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 max-w-3xl">
            <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>

            <h1 className="text-3xl font-bold mb-8">Edit Fragrance</h1>

            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                        e.preventDefault();
                    }
                }}
                className="space-y-8 bg-card border p-8 rounded-lg shadow-sm"
            >

                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Input placeholder="e.g. Citrus, Woody, Eau de Parfum" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Gender</label>
                            <select
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.gender}
                                onChange={e => setFormData({ ...formData, gender: e.target.value as "Men" | "Women" | "Unisex" })}
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Origin</label>
                            <Input placeholder="e.g. Paris, France" value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Discount Percentage (%)</label>
                            <Input
                                type="number"
                                min="0" max="100"
                                placeholder="0 for no discount"
                                value={formData.discount || ''}
                                onChange={e => setFormData({ ...formData, discount: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Offer Valid Until (Optional)</label>
                            <Input
                                type="date"
                                value={formData.discountEndDate ? formData.discountEndDate.split('T')[0] : ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, discountEndDate: val ? new Date(val).toISOString() : undefined })
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Image URL or Upload</label>
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="flex-1"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={uploadingImage}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setUploadingImage(true);
                                                try {
                                                    const url = await compressAndUploadImage(file);
                                                    if (url) {
                                                        setFormData({ ...formData, image: url });
                                                    }
                                                } catch (error: any) {
                                                    console.error("Upload failed", error);
                                                    alert("Failed to upload image: " + (error?.message || "Unknown error"));
                                                } finally {
                                                    setUploadingImage(false);
                                                }
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <Button type="button" variant="outline" className="pointer-events-none" disabled={uploadingImage}>
                                        {uploadingImage ? "Uploading..." : "Upload"}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Paste a URL or upload a local image (automatically compressed & saved to Supabase Cloud).</p>
                            {formData.image && (
                                <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border mt-2">
                                    <Image
                                        src={formData.image}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Fragrance Notes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Top Notes</label>
                            <textarea
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.notes?.top}
                                onChange={e => setFormData({ ...formData, notes: { ...formData.notes!, top: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Heart Notes</label>
                            <textarea
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.notes?.heart}
                                onChange={e => setFormData({ ...formData, notes: { ...formData.notes!, heart: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Base Notes</label>
                            <textarea
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.notes?.base}
                                onChange={e => setFormData({ ...formData, notes: { ...formData.notes!, base: e.target.value } })}
                            />
                        </div>
                    </div>
                </div>

                {/* Variants */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold">Size Variants</h3>
                        <Button type="button" size="sm" variant="outline" onClick={addVariant}><Plus className="h-4 w-4 mr-1" /> Add Size</Button>
                    </div>

                    {formData.variants?.map((variant, index) => (
                        <div key={index} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Size (e.g. 100ml)</label>
                                <Input value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Price (LKR)</label>
                                <Input type="number" min="0" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Qty</label>
                                <Input type="number" min="0" value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', e.target.value)} />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeVariant(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t">
                    <input
                        type="checkbox"
                        id="isSignature"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.isSignature}
                        onChange={e => setFormData({ ...formData, isSignature: e.target.checked })}
                    />
                    <label htmlFor="isSignature" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Set as Signature Scent
                    </label>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Update Product" : "Update Product"}
                </Button>
            </form>
        </div>
    );
}

export default function EditProductPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <Suspense fallback={<div className="container mx-auto px-4 text-center">Loading...</div>}>
                    <EditProductContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
