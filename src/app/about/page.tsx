import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <div className="relative py-24 bg-muted text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Story</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Crafting memories through the art of perfumery.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-20 space-y-20">
                    {/* Section 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 order-2 md:order-1">
                            <h2 className="text-3xl font-bold">The Beginning</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                FlavorZest began with a simple yet profound belief: that a fragrance is more than just a scent; it's an invisible accessory that defines who you are. Founded in 2024, we set out to bridge the gap between traditional artisanal perfumery and modern luxury.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Our journey started in the heart of Grasse, France, where we collaborated with master perfumers to source the finest ingredients from around the world.
                            </p>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] bg-secondary rounded-lg overflow-hidden order-1 md:order-2">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                About Image 1 Placeholder
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square md:aspect-[4/3] bg-secondary rounded-lg overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                About Image 2 Placeholder
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Sustainable Luxury</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We believe that luxury shouldn't come at a cost to the planet. That's why every bottle of FlavorZest is crafted with sustainable practices in mind. From our ethically sourced agarwood to our recyclable glass bottles, we are committed to reducing our environmental footprint.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
