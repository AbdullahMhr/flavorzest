"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProducts } from "@/lib/context/ProductContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { Plus, Edit, Trash2, Star, Bell, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/lib/context/NotificationContext";
import { useAuth } from "@/lib/context/AuthContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export default function AdminDashboard() {
    const router = useRouter();
    const { products, deleteProduct, updateProduct, updateProductsOrder } = useProducts();
    const { settings, updateSettings } = useSettings();
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const { isAuthenticated, isInitializing, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [heroImageInput, setHeroImageInput] = useState("");

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        const reorderedProducts = Array.from(products);
        const [removed] = reorderedProducts.splice(sourceIndex, 1);
        reorderedProducts.splice(destinationIndex, 0, removed);

        await updateProductsOrder(reorderedProducts);
    };

    useEffect(() => {
        if (isAuthenticated && !isInitializing) {
            setHeroImageInput(settings.heroImage);
        }
    }, [isAuthenticated, isInitializing, settings.heroImage]);

    if (isInitializing) {
        return <div className="min-h-screen flex items-center justify-center bg-muted/30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    if (!isAuthenticated) return null;

    const toggleSignature = async (id: string, currentStatus: boolean) => {
        await updateProduct(id, { isSignature: !currentStatus });
    };

    const toggleVisibility = async (id: string, isHidden: boolean | undefined) => {
        await updateProduct(id, { isHidden: !isHidden });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this fragrance? This action cannot be undone.")) {
            await deleteProduct(id);
        }
    };

    const handleSaveSettings = () => {
        if (heroImageInput.trim()) {
            updateSettings({ heroImage: heroImageInput.trim() });
            alert("Settings updated!");
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        {/* Notifications ... */}
                        <div className="flex gap-2 items-center">
                            {/* Notifications component unchanged */}
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

                            <Button variant="outline" onClick={async () => {
                                await logout();
                            }}>
                                Logout
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                        {/* Settings Card */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm col-span-1 lg:col-span-4 flex flex-col sm:flex-row gap-4 items-end">
                            <div className="space-y-2 flex-1 relative z-10">
                                <label className="text-sm font-medium">Hero Image URL</label>
                                <Input
                                    value={heroImageInput}
                                    onChange={(e) => setHeroImageInput(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full"
                                />
                            </div>
                            <Button onClick={handleSaveSettings} className="relative z-10 w-full sm:w-auto">Save Global Settings</Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Product Management</h2>
                        <Button className="gap-2" asChild>
                            <Link href="/admin/add">
                                <Plus className="h-4 w-4" /> Add New Fragrance
                            </Link>
                        </Button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="bg-card border rounded-lg overflow-hidden shadow-sm relative z-10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Drag to Sort</th>
                                            <th className="px-6 py-4">Image</th>
                                            <th className="px-6 py-4">Product Name</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price (LKR)</th>
                                            <th className="px-6 py-4 text-center">Settings</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <Droppable droppableId="products-list">
                                        {(provided) => (
                                            <tbody
                                                className="divide-y text-foreground"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {products.map((product, index) => (
                                                    <Draggable key={product.id} draggableId={product.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <tr
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={cn(
                                                                    "transition-colors",
                                                                    product.isHidden ? "bg-muted/40 opacity-70" : "hover:bg-muted/50",
                                                                    snapshot.isDragging ? "bg-muted shadow-lg" : ""
                                                                )}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    display: snapshot.isDragging ? "table" : ""
                                                                }}
                                                            >
                                                                <td className="px-6 py-4">
                                                                    <div
                                                                        {...provided.dragHandleProps}
                                                                        className="flex flex-col gap-1 items-center justify-center cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
                                                                    >
                                                                        <span className="text-muted-foreground font-bold text-lg">#{index + 1}</span>
                                                                        <div className="flex flex-col gap-[2px]">
                                                                            <div className="w-4 h-[2px] bg-muted-foreground/50 rounded-full" />
                                                                            <div className="w-4 h-[2px] bg-muted-foreground/50 rounded-full" />
                                                                            <div className="w-4 h-[2px] bg-muted-foreground/50 rounded-full" />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="h-12 w-12 relative rounded overflow-hidden bg-muted">
                                                                        {product.image ? (
                                                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                                        ) : (
                                                                            <div className="absolute inset-0 flex items-center justify-center text-[8px]">No img</div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 font-medium flex items-center gap-2 h-20">
                                                                    {product.name}
                                                                    {product.isHidden && <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded ml-2">Hidden</span>}
                                                                </td>
                                                                <td className="px-6 py-4">{product.category}</td>
                                                                <td className="px-6 py-4">
                                                                    {product.variants && product.variants.length > 0
                                                                        ? `LKR ${Math.min(...product.variants.map(v => v.price)).toLocaleString()} +`
                                                                        : `LKR ${product.price.toLocaleString()}`
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <div className="flex items-center justify-center gap-3">
                                                                        <button
                                                                            onClick={() => toggleSignature(product.id, product.isSignature)}
                                                                            className={cn("transition-colors hover:scale-110", product.isSignature ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400")}
                                                                            title="Toggle Signature Scent"
                                                                        >
                                                                            <Star className={cn("h-5 w-5", product.isSignature && "fill-current")} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => toggleVisibility(product.id, product.isHidden)}
                                                                            className="transition-colors text-muted-foreground hover:text-primary p-1"
                                                                            title={product.isHidden ? "Show Product" : "Hide Product"}
                                                                        >
                                                                            {product.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
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
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                {products.length === 0 && (
                                                    <tr>
                                                        <td colSpan={7} className="text-center py-8 text-muted-foreground">No fragrances found. Add one to get started.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        )}
                                    </Droppable>
                                </table>
                            </div>
                        </div>
                    </DragDropContext>
                </div>
            </main>
            <Footer />
        </div>
    );
}
