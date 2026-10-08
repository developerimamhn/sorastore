alter table public.products
  add column if not exists compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  add column if not exists available_sizes text[] not null default array['S', 'M', 'L', 'XL', 'XXL', 'XXXL']::text[];