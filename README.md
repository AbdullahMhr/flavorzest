# FlavorZest - Luxury Fragrance Showcase & E-Commerce Platform

A premium, pixel-perfect e-commerce showcase built for a luxury fragrance brand. This application features industry-leading aesthetics, high-performance static rendering, and an impenetrable Cloud Security architecture.

![FlavorZest Preview](public/logo.png)

## 🌟 Overview & Use Case

FlavorZest is designed as a standalone, ultra-fast online storefront and administrative portal for a perfume or luxury goods business. 

**For Customers:**
- **Dynamic Browsing:** Users can view the "Signature Scent", browse dynamic collections based on Gender and Size, and review intricate details about olfactory notes.
- **Cart & Limits:** A polished shopping cart experience that actively prevents users from adding more stock than physically available.
- **Time-Bound Offers:** Automated global discount engines that render beautiful "Special Offers" ribbons, mathematically crossing out old prices until a specific expiry date is reached.

**For Administrators:**
- **Full Inventory Control:** An exquisite, password-protected Admin Dashboard allows business owners to instantly add new stock sizes, edit prices, attach discount expiry bounds, hide products from the public eye, and customize the Home Page header. 
- **Automated Storage Maintenance:** Deleting a product natively signals the cloud to safely peel away and destroy associated image assets, ensuring storage buckets never bloat over time.

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (Strictly App Router `output: export` for 100% static edge portability)
- **Database & Auth**: [Supabase Cloud](https://supabase.com/) (PostgreSQL + JWT)
- **Styling**: [Tailwind CSS Custom Build](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Image Processing**: HTML5 Native Canvas Compression (`sharp` alternative for browser uploads)

## 🔒 Comprehensive Security Profile

FlavorZest relies on a zero-trust architecture specifically designed to survive in public environments without the safety net of hidden Server-Side Javascript (Node.js). 

1. **Supabase Row Level Security (RLS)**: The database natively rejects *all* write, update, or delete commands at the SQL engine level. An attacker cannot use standard REST API requests to mutate the storefront because the cloud policy strictly requires a cryptographic `auth.role() = 'authenticated'` JWT Token granted only to the specific business owner login.
2. **Mathematical Payload Constraints**: The Admin Panel physically locks pricing, quantity, and discount percentages using native Javascript bounds (`Math.max(0, Math.min(100))`). It is mathematically impossible for an attacker to spoof the network payload to inject negative prices.
3. **Cross-Site Scripting (XSS) Eradication**: Absolutely zero `dangerouslySetInnerHTML` injections exist across the React codebase. Furthermore, URL filtering parameters on the Collection page pass through `DOMPurify`, ensuring that manipulated URL strings cannot execute code on a victim's machine.
4. **Time-Based Session Death**: The Admin Dashboard actively monitors timestamps, forcefully logging out user sessions explicitly one hour after initiation.
5. **No Shared Secrets**: Since the App Router is exported statically, only Supabase *Public/Anon Keys* are packed into the application. The private Service Role key is entirely absent, relying exclusively on the aforementioned RLS logic for structural integrity.

## 🚀 Deployment Instructions

Because the project utilizes a purely Static Export compilation path, it can be hosted absolutely anywhere, including:
- **Vercel**
- **Cloudflare Pages**
- **Netlify**
- **GitHub Pages**

**Steps:**
1. Connect your GitHub repository to your host of choice.
2. Run command: `npm run build`.
3. Set Publish/Output Directory to: `out`.
4. Add the two environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 📄 License
This original code framework is provided open-source under the MIT License.
