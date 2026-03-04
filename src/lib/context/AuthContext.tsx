"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../supabase";

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    isInitializing: boolean;
    login: (password: string, username?: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Initial session check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            let isSessionValid = !!session;
            let userIsAdmin = false;

            if (session) {
                // Interrogate profiles table for real admin privileges
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', session.user.id)
                    .single();

                userIsAdmin = !!profile?.is_admin;
            }

            // Failsafe: if there's a session but the user is not a real admin, boot them
            if (session && !userIsAdmin) {
                await supabase.auth.signOut();
                isSessionValid = false;
            }

            // Validate absolute 2-hour timeout
            const loginTimeStr = typeof window !== 'undefined' ? localStorage.getItem('admin_login_timestamp') : null;

            if (isSessionValid && loginTimeStr) {
                const loginTime = parseInt(loginTimeStr, 10);
                const twoHours = 2 * 60 * 60 * 1000;

                if (Date.now() - loginTime > twoHours) {
                    await supabase.auth.signOut();
                    if (typeof window !== 'undefined') localStorage.removeItem('admin_login_timestamp');
                    isSessionValid = false;
                }
            } else if (isSessionValid && !loginTimeStr) {
                // Failsafe: if there's a session but no tracking stamp, boot them to enforce security limits
                await supabase.auth.signOut();
                isSessionValid = false;
            }

            setIsAuthenticated(isSessionValid);
            setIsAdmin(userIsAdmin);
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

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error || !user) {
            console.error("Login Error:", error?.message || "User missing");
            return false;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            await supabase.auth.signOut();
            console.error("Access Denied: User is not an admin.");
            return false;
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_login_timestamp', Date.now().toString());
        }
        setIsAdmin(true);
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
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, isInitializing, login, logout }}>
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
