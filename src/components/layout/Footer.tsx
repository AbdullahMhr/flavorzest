import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t-2 border-primary/20 bg-background py-16 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-serif font-bold text-primary tracking-wide">FlavorZest</h3>
                        <p className="text-sm text-muted-foreground w-full md:w-[80%] leading-relaxed">
                            Premium fragrances crafted to leave a lasting impression. Discover scents that define your presence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/80">Shop</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/collection" className="hover:text-primary transition-colors">All Fragrances</Link></li>
                            <li><Link href="/collection?gender=Men" className="hover:text-primary transition-colors">For Him</Link></li>
                            <li><Link href="/collection?gender=Women" className="hover:text-primary transition-colors">For Her</Link></li>
                            <li><Link href="/collection?gender=Unisex" className="hover:text-primary transition-colors">Gender Neutral</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/80">Contact</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>57/3, Hinguloya, Mawanella</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>077 723 9936</span>
                            </li>
                            <li><Link href="/about" className="hover:text-primary transition-colors block mt-2">Our Story</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Connect</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} FlavorZest. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
