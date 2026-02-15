"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useProducts } from "./ProductContext";

export interface Notification {
    id: string;
    type: "low_stock" | "order";
    message: string;
    read: boolean;
    timestamp: number;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { products } = useProducts();

    // Check for low stock logic
    useEffect(() => {
        const lowStockItems = products.filter(p =>
            p.variants?.some(v => v.quantity < 5) ||
            (p.variants?.length === 0 && (p as any).stock < 5) // Fallback if no variants
        );

        const newNotifications: Notification[] = [];

        lowStockItems.forEach(item => {
            const lowVariants = item.variants?.filter(v => v.quantity < 5) || [];
            if (lowVariants.length > 0) {
                lowVariants.forEach(v => {
                    const id = `stock-${item.id}-${v.size}`;
                    // Avoid duplicates
                    if (!notifications.some(n => n.id === id)) {
                        newNotifications.push({
                            id,
                            type: "low_stock",
                            message: `Low stock alert: ${item.name} (${v.size}) has ${v.quantity} remaining.`,
                            read: false,
                            timestamp: Date.now()
                        });
                    }
                });
            }
        });

        if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev]);
        }
    }, [products]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
