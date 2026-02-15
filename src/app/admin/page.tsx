"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect } from "react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/admin/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin") {
            const success = login(password);
            if (success) {
                router.push("/admin/dashboard");
            } else {
                setError("Invalid password");
            }
        } else {
            setError("Invalid username");
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-muted/30">
                <div className="w-full max-w-md p-8 bg-card border rounded-lg shadow-lg">
                    <div className="flex flex-col items-center mb-8">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                        <p className="text-muted-foreground">Sign in to manage products</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Username</label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="•••••"
                            />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}
