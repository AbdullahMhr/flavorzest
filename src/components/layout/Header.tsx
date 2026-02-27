"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LABELS: Record<string, string[]> = {
    "/": ["Home", "முகப்பு", "සිහින", "الصفحة الرئيسية", "घर"],
    "/collection": ["Our Collection", "சேகரிப்பு", "එකතුව", "مجموعتنا", "संग्रह"],
    "/about": ["About Us", "பற்றி", "අපි ගැන", "معلومات عنا", "बारे में"],
    "/contact": ["Contact", "தொடர்பு", "අමතන්න", "اتصل", "संपर्क"]
};

function LanguageLink({ path }: { path: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const [index, setIndex] = useState(0);
    const languages = LABELS[path] || [path];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered) {
            interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % languages.length);
            }, 600); // Change every 600ms
        } else {
            setIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovered, languages.length]);

    return (
        <Link
            href={path}
            className="relative group py-1 transition-colors hover:text-primary min-w-[60px] text-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-6 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="block whitespace-nowrap"
                    >
                        {languages[index]}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-center" />
        </Link>
    );
}

export function Header() {
    const router = useRouter();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { setIsCartOpen, cartCount } = useCart();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/collection?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm shrink-0"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            <Image
                                src="/logo.png"
                                alt="FlavorZest Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                        <span className="text-xl font-bold tracking-tight text-primary hidden sm:inline-block">FlavorZest</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {["/", "/collection", "/about", "/contact"].map((path) => (
                        <LanguageLink key={path} path={path} />
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {isSearchOpen ? (
                        <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                            <Input
                                placeholder="Search..."
                                className="h-9 w-[150px] md:w-[200px] border-primary/30 focus-visible:ring-primary/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <Button type="submit" size="sm" variant="ghost" className="hover:text-primary hover:bg-primary/10">Go</Button>
                            <Button type="button" size="sm" variant="ghost" className="hover:text-primary hover:bg-primary/10" onClick={() => setIsSearchOpen(false)}>X</Button>
                        </form>
                    ) : (
                        <div className="relative group flex items-center justify-center">
                            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchOpen(true)} className="hover:text-primary hover:bg-primary/10 transition-colors">
                                <Search className="h-5 w-5" />
                            </Button>
                            <span className="absolute -bottom-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-background/95 text-primary text-xs py-1 px-2 rounded-md backdrop-blur-sm border border-primary/30 whitespace-nowrap z-[60]">
                                Search
                            </span>
                        </div>
                    )}

                    <div className="relative group hidden sm:flex items-center justify-center">
                        <Button variant="ghost" size="icon" aria-label="Account" className="hover:text-primary hover:bg-primary/10 transition-colors" asChild>
                            <Link href="/admin"><User className="h-5 w-5" /></Link>
                        </Button>
                        <span className="absolute -bottom-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-background/95 text-primary text-xs py-1 px-2 rounded-md backdrop-blur-sm border border-primary/30 whitespace-nowrap z-[60]">
                            Admin
                        </span>
                    </div>

                    <div className="relative group flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Cart"
                            onClick={() => setIsCartOpen(true)}
                            className="relative hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                        <span className="absolute -bottom-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 bg-background/95 text-primary text-xs py-1 px-2 rounded-md backdrop-blur-sm border border-primary/30 whitespace-nowrap z-[60]">
                            Cart
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            <nav className="flex flex-col gap-4">
                                {["/", "/collection", "/about", "/contact"].map((path) => (
                                    <Link
                                        key={path}
                                        href={path}
                                        className="text-lg font-medium py-2 border-b border-border/50 last:border-0"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                                    </Link>
                                ))}
                                <Link
                                    href="/admin"
                                    className="text-lg font-medium py-2 border-b border-border/50 flex items-center gap-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User className="h-4 w-4" /> Account
                                </Link>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
