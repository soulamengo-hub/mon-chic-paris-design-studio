-- MON CHIC PARIS · Release 3.1A + 3.1B
-- Im Supabase SQL Editor einmal vollständig ausführen.

alter table products add column if not exists subcategory text;
alter table products add column if not exists secondary_color text;
alter table products add column if not exists original_size text;
alter table products add column if not exists size_system text;
alter table products add column if not exists de_size text;
alter table products add column if not exists international_size text;
alter table products add column if not exists measurements text;
alter table products add column if not exists flaws text;

create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  file_name text,
  mime_type text,
  size_bytes bigint,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_sort_idx on product_images(product_id, sort_order);

alter table product_images enable row level security;
drop policy if exists "product_images_select_public" on product_images;
create policy "product_images_select_public" on product_images for select using (true);
drop policy if exists "product_images_insert_public" on product_images;
create policy "product_images_insert_public" on product_images for insert with check (true);
drop policy if exists "product_images_update_public" on product_images;
create policy "product_images_update_public" on product_images for update using (true) with check (true);
drop policy if exists "product_images_delete_public" on product_images;
create policy "product_images_delete_public" on product_images for delete using (true);
grant select, insert, update, delete on table product_images to anon;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set public = true, file_size_limit = 8388608;

drop policy if exists "product_images_storage_select" on storage.objects;
create policy "product_images_storage_select" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "product_images_storage_insert" on storage.objects;
create policy "product_images_storage_insert" on storage.objects for insert with check (bucket_id = 'product-images');
drop policy if exists "product_images_storage_update" on storage.objects;
create policy "product_images_storage_update" on storage.objects for update using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
drop policy if exists "product_images_storage_delete" on storage.objects;
create policy "product_images_storage_delete" on storage.objects for delete using (bucket_id = 'product-images');

notify pgrst, 'reload schema';
