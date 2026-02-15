import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignatureScentSection } from "@/components/feature/SignatureScentSection";
import { FeaturedProductsSection } from "@/components/feature/FeaturedProductsSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2560&auto=format&fit=crop)' }}
          />

          <div className="relative z-20 container mx-auto px-4 text-center space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Experience the Essence of Luxury
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Premium fragrances crafted to leave a lasting impression. Discover scents that define your presence and elevate your spirit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
                <Link href="/collection">Explore Collection</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-black text-lg px-8">
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Curated Selections</h2>
                <p className="text-muted-foreground">Handpicked favorites for every occasion.</p>
              </div>
              <Link href="/collection" className="hidden md:flex items-center text-primary hover:underline hover:underline-offset-4">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <FeaturedProductsSection />

            <div className="mt-8 text-center md:hidden">
              <Button variant="ghost" className="text-primary">
                <Link href="/collection">View All Collection</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <SignatureScentSection />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
