-- 1. Create the profiles table to store extended user data including admin status
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Optional: Enable RLS on profiles so users can only read their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- 3. Update products and product_variants write policies to require admin privileges
-- First, drop the old policies
DROP POLICY IF EXISTS "Allow write access for authenticated users on products" ON products;
DROP POLICY IF EXISTS "Allow write access for authenticated users on variants" ON product_variants;

-- Second, create the new strict admin-only policies
CREATE POLICY "Allow write access for admin users on products" ON products 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

CREATE POLICY "Allow write access for admin users on variants" ON product_variants 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
);

-- Note: Because we use Supabase storage for images, you should also apply this policy to the storage bucket:
-- CREATE POLICY "Admin users can upload/delete images" ON storage.objects FOR ALL TO authenticated USING (
--     bucket_id = 'perfumes' AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
-- );

-- 4. Automatically create a profile for new users (ensure you manually update the first admin's is_admin to true in Supabase studio!)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, is_admin)
  VALUES (new.id, false);
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
