create table if not exists products(
 id bigint generated always as identity primary key,
 name text not null, category text not null default 'Men',
 price int not null check(price>=0), description text default '',
 image_url text default '', color text default '#2f4a7a',
 stock int not null default 0 check(stock>=0), active boolean default true,
 created_at timestamptz default now());
create table if not exists orders(
 id bigint generated always as identity primary key,
 order_no text unique not null, name text, phone text, address text, area text,
 items jsonb not null, subtotal int, delivery int, total int,
 status text default 'new', created_at timestamptz default now());
alter table products enable row level security;
alter table orders enable row level security;
-- public can only read active products. Orders are written/read by the server (service role) only.
create policy "public read active products" on products for select using (active);
insert into products(name,category,price,description,color,stock) values
('Cotton Panjabi','Men',1850,'Light 100% cotton, relaxed fit','#2f4a7a',20),
('Everyday T-shirt','Men',650,'180 GSM cotton, regular fit','#f0a81e',50),
('Printed Kurti','Women',1250,'Cotton with block print, straight cut','#c4483f',25),
('Fleece Hoodie','Men',1650,'Soft brushed fleece','#6b4a3a',15);

-- product photo storage (public read; uploads only via the server)
insert into storage.buckets (id, name, public) values ('products','products',true) on conflict (id) do nothing;
create policy "public read product photos" on storage.objects for select using (bucket_id = 'products');

alter table orders add column if not exists payment text not null default 'cod', add column if not exists trx_id text;
