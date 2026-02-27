import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ProductProvider } from "@/lib/context/ProductContext";
import { CartProvider } from "@/lib/context/CartContext";
import { CartDrawer } from "@/components/feature/CartDrawer";
import { AuthProvider } from "@/lib/context/AuthContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import { BackgroundLines } from "@/components/layout/BackgroundLines";
import { SettingsProvider } from "@/lib/context/SettingsContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "FlavorZest | Luxury Fragrances",
  description: "Discover your signature scent with FlavorZest's exclusive collection of luxury perfumes.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", manrope.variable)} suppressHydrationWarning>
        <SettingsProvider>
          <ProductProvider>
            <CartProvider>
              <AuthProvider>
                <NotificationProvider>
                  <BackgroundLines />
                  <div className="relative z-10 w-full h-full">
                    {children}
                    <CartDrawer />
                  </div>
                </NotificationProvider>
              </AuthProvider>
            </CartProvider>
          </ProductProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
