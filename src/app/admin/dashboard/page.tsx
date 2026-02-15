"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/lib/context/ProductContext";
import { Plus, Edit, Trash2, Star, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/lib/context/NotificationContext";

export default function AdminDashboard() {
    const router = useRouter();
    const { products, deleteProduct, updateProduct } = useProducts();
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        if (!isAdmin) {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return null;

    const toggleSignature = (id: string, currentStatus: boolean) => {
        updateProduct(id, { isSignature: !currentStatus });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this fragrance? This action cannot be undone.")) {
            deleteProduct(id);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Product Management</h1>
                        <div className="flex gap-2 items-center">
                            {/* Notifications */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive" />
                                    )}
                                </Button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-popover border rounded-md shadow-lg z-50 p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-sm">Notifications</h3>
                                            {notifications.length > 0 && (
                                                <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
                                            )}
                                        </div>
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
                                            ) : (
                                                notifications.map(n => (
                                                    <div key={n.id} className={cn("p-2 rounded bg-muted/50 text-sm", !n.read && "border-l-2 border-primary bg-muted")}>
                                                        <p>{n.message}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button className="gap-2" asChild>
                                <Link href="/admin/add">
                                    <Plus className="h-4 w-4" /> Add New Fragrance
                                </Link>
                            </Button>
                            <Button variant="outline" onClick={() => {
                                localStorage.removeItem("isAdmin");
                                window.location.href = "/admin";
                            }}>
                                Logout
                            </Button>
                        </div>
                    </div>

                    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price (LKR)</th>
                                        <th className="px-6 py-4 text-center">Signature</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-foreground">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="h-12 w-12 relative rounded overflow-hidden bg-muted">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-[8px]">No img</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{product.name}</td>
                                            <td className="px-6 py-4">{product.category}</td>
                                            <td className="px-6 py-4">
                                                {product.variants && product.variants.length > 0
                                                    ? `LKR ${Math.min(...product.variants.map(v => v.price)).toLocaleString()} +`
                                                    : `LKR ${product.price.toLocaleString()}`
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleSignature(product.id, product.isSignature)}
                                                    className={cn("transition-colors hover:scale-110", product.isSignature ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400")}
                                                    title="Toggle Signature Scent"
                                                >
                                                    <Star className={cn("h-5 w-5", product.isSignature && "fill-current")} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                        <Link href={`/admin/edit?id=${product.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">No fragrances found. Add one to get started.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
