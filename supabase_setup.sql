-- 1. Create the Products Table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  gender text NOT NULL,
  notes jsonb NOT NULL,
  origin text NOT NULL,
  "isSignature" boolean DEFAULT false,
  "order" numeric DEFAULT 0,
  "isHidden" boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Product Variants Table (sizes, prices, stock)
CREATE TABLE product_variants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  price numeric NOT NULL,
  quantity numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set Up Row Level Security (RLS) Rules
-- Enable RLS on tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to variants" ON product_variants FOR SELECT USING (true);

-- Allow write access only to authenticated admin users
CREATE POLICY "Allow write access for authenticated users on products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access for authenticated users on variants" ON product_variants FOR ALL USING (auth.role() = 'authenticated');
