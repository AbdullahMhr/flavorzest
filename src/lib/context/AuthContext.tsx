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

            let adminStatus = false;
            if (isSessionValid && session) {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('is_admin')
                        .eq('id', session.user.id)
                        .single();
                    if (data?.is_admin) {
                        adminStatus = true;
                    }
                } catch (err) {
                    console.error("Error fetching profile:", err);
                }
            }

            setIsAuthenticated(isSessionValid);
            setIsAdmin(adminStatus);
            setIsInitializing(false);

            if (pathname?.startsWith("/admin") && pathname !== "/admin" && !adminStatus) {
                router.push("/admin");
            }
        };

        checkSession();

        // Listen for auth changes to sync tabs automatically
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            let adminStatus = false;
            let isSessionValid = !!session;

            if (session) {
                try {
                    const { data } = await supabase
                        .from('profiles')
                        .select('is_admin')
                        .eq('id', session.user.id)
                        .single();
                    if (data?.is_admin) adminStatus = true;
                } catch (err) {
                    console.error("Error on auth state change:", err);
                }
            }

            setIsAuthenticated(isSessionValid);
            setIsAdmin(adminStatus);
            if (!adminStatus && pathname?.startsWith("/admin") && pathname !== "/admin") {
                router.push("/admin");
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    const login = async (password: string, username?: string) => {
        if (!username || !password) return false;

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error || !authData.session) {
            console.error("Login Error:", error?.message);
            return false;
        }

        // Check is_admin immediately
        try {
            const { data } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', authData.session.user.id)
                .single();

            if (!data?.is_admin) {
                await supabase.auth.signOut();
                console.error("Login Error: User is not an administrator");
                return false;
            }
        } catch (err) {
            await supabase.auth.signOut();
            console.error("Login Error: Could not verify administrator status");
            return false;
        }

        // Admin verified
        setIsAdmin(true);

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
