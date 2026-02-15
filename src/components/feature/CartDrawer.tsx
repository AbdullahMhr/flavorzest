"use client";

import { useCart } from "@/lib/context/CartContext";
import { Button } from "@/components/ui/Button";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsCartOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setIsCartOpen]);

    const handleCheckout = () => {
        // 1. Save order to local storage (Simple log)
        const orderData = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: cart,
            total: cartTotal,
            status: "Pending" // In a real app this would be updated
        };

        const existingOrders = JSON.parse(localStorage.getItem("flavorzest_orders") || "[]");
        localStorage.setItem("flavorzest_orders", JSON.stringify([...existingOrders, orderData]));

        // 2. Format WhatsApp Message
        const phoneNumber = "94777239936"; // 0777239936 in international format without +
        const message = `*New Order from FlavorZest Website*
    
*Order ID:* ${orderData.id}
*Date:* ${new Date().toLocaleDateString()}

*Items:*
${cart.map(item => `- ${item.name} (${item.size}) x${item.quantity}: LKR ${(item.price * item.quantity).toLocaleString()}`).join("\n")}

*Total Amount:* LKR ${cartTotal.toLocaleString()}

I would like to confirm my order. Please let me know the payment details.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // 3. Redirect
        window.open(whatsappUrl, "_blank");
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col border-l"
                        ref={drawerRef}
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" /> Shopping Cart
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                    <ShoppingBag className="h-16 w-16 opacity-20" />
                                    <p>Your cart is empty</p>
                                    <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={`${item.productId}-${item.size}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex gap-4 p-3 rounded-lg border bg-card/50"
                                    >
                                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground">{item.size}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 border rounded-md h-8 px-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId, item.size)}
                                                        className="text-xs text-destructive hover:underline mt-1"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-4 border-t bg-muted/20 space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total</span>
                                    <span>LKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Shipping & taxes calculated at checkout via WhatsApp.
                                </p>
                                <Button size="lg" className="w-full" onClick={handleCheckout}>
                                    Checkout on WhatsApp
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
