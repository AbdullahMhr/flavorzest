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

            // Validate absolute 2-hour timeout
            let isSessionValid = !!session;
            const loginTimeStr = typeof window !== 'undefined' ? localStorage.getItem('admin_login_timestamp') : null;

            if (session && loginTimeStr) {
                const loginTime = parseInt(loginTimeStr, 10);
                const twoHours = 2 * 60 * 60 * 1000;

                if (Date.now() - loginTime > twoHours) {
                    await supabase.auth.signOut();
                    if (typeof window !== 'undefined') localStorage.removeItem('admin_login_timestamp');
                    isSessionValid = false;
                }
            } else if (session && !loginTimeStr) {
                // Failsafe: if there's a session but no tracking stamp, boot them to enforce security limits
                await supabase.auth.signOut();
                isSessionValid = false;
            }

            setIsAuthenticated(isSessionValid);
            setIsInitializing(false);

            if (pathname?.startsWith("/admin") && pathname !== "/admin" && !isSessionValid) {
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

        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_login_timestamp', Date.now().toString());
        }
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_login_timestamp');
        }
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
