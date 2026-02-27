-- Create the 'perfumes' public storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'perfumes', 
  'perfumes', 
  true, 
  5242880, -- 5MB absolute limit (we will compress way below this)
  array['image/jpeg', 'image/png', 'image/webp']
);

-- Enable RLS on the storage.objects table
alter table storage.objects enable row level security;

-- Allow public read access (so anyone visiting flavorzest.lk can see the pictures)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'perfumes' );

-- Allow authenticated admins to upload new images
create policy "Admin Upload"
  on storage.objects for insert
  with check ( bucket_id = 'perfumes' and auth.role() = 'authenticated' );

-- Allow authenticated admins to update/replace images
create policy "Admin Update"
  on storage.objects for update
  with check ( bucket_id = 'perfumes' and auth.role() = 'authenticated' );

-- Allow authenticated admins to delete images
create policy "Admin Delete"
  on storage.objects for delete
  using ( bucket_id = 'perfumes' and auth.role() = 'authenticated' );
