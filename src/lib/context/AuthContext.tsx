"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../supabase";

interface AuthContextType {
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (password: string, username?: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Initial session check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsInitializing(false);

            if (pathname?.startsWith("/admin") && pathname !== "/admin" && !session) {
                router.push("/admin");
            }
        };

        checkSession();

        // Listen for auth changes to sync tabs automatically
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            if (!session && pathname?.startsWith("/admin") && pathname !== "/admin") {
                router.push("/admin");
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    const login = async (password: string, username?: string) => {
        if (!username || !password) return false;

        const { error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error) {
            console.error("Login Error:", error.message);
            return false;
        }

        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        router.push("/admin");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isInitializing, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
