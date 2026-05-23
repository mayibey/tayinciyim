-- Storage buckets — Supabase Dashboard veya SQL ile

insert into storage.buckets (id, name, public)
values
  ('listing-images', 'listing-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

-- listing-images: public read
drop policy if exists "listing_images_public_read" on storage.objects;
create policy "listing_images_public_read" on storage.objects
  for select using (bucket_id = 'listing-images');

-- listing-images: authenticated upload
drop policy if exists "listing_images_auth_upload" on storage.objects;
create policy "listing_images_auth_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'listing-images');

-- Service role upload (server) bypasses RLS — production'da service role yalnız sunucuda

-- avatars: public read
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_auth_upload" on storage.objects;
create policy "avatars_auth_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars');

-- TODO: file size/type validation (bucket policy veya edge function)
