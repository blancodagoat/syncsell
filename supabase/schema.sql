-- Users (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Channel connections (Shopify, Etsy, etc.)
create table public.channel_connections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  channel_type text not null check (channel_type in ('shopify', 'etsy', 'ebay', 'woocommerce')),
  shop_domain text, -- for Shopify
  access_token text not null, -- encrypted
  refresh_token text,
  token_expires_at timestamptz,
  is_active boolean default true not null,
  last_sync_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, channel_type, shop_domain)
);

-- Products from each channel
create table public.channel_products (
  id uuid default gen_random_uuid() primary key,
  connection_id uuid references public.channel_connections(id) on delete cascade not null,
  external_product_id text not null,
  title text not null,
  sku text,
  quantity integer default 0 not null,
  price_cents integer,
  currency text default 'USD',
  listing_url text,
  last_fetched_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  unique(connection_id, external_product_id)
);

-- Linked products (master -> targets)
create table public.product_links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  source_connection_id uuid references public.channel_connections(id) on delete cascade not null,
  source_product_id uuid references public.channel_products(id) on delete cascade not null,
  sync_direction text not null check (sync_direction in ('one_way', 'two_way')),
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  unique(source_product_id)
);

-- Target products for each link
create table public.link_targets (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references public.product_links(id) on delete cascade not null,
  target_connection_id uuid references public.channel_connections(id) on delete cascade not null,
  target_product_id uuid references public.channel_products(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(link_id, target_product_id)
);

-- Sync log for debugging
create table public.sync_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  link_id uuid references public.product_links(id) on delete cascade not null,
  action text not null, -- 'sync', 'conflict', 'error'
  status text not null, -- 'success', 'failed', 'pending'
  details jsonb,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_channel_products_connection on channel_products(connection_id);
create index idx_channel_products_sku on channel_products(sku) where sku is not null;
create index idx_product_links_user on product_links(user_id);
create index idx_sync_logs_user on sync_logs(user_id);
create index idx_sync_logs_link on sync_logs(link_id);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.channel_connections enable row level security;
alter table public.channel_products enable row level security;
alter table public.product_links enable row level security;
alter table public.link_targets enable row level security;
alter table public.sync_logs enable row level security;

-- RLS Policies
-- Profiles: user can only see their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Channel connections: user can only see their own
create policy "Users can view own connections" on channel_connections for select using (auth.uid() = user_id);
create policy "Users can insert own connections" on channel_connections for insert with check (auth.uid() = user_id);
create policy "Users can update own connections" on channel_connections for update using (auth.uid() = user_id);
create policy "Users can delete own connections" on channel_connections for delete using (auth.uid() = user_id);

-- Channel products: user can only see products from their connections
create policy "Users can view own products" on channel_products for select using (
  exists (
    select 1 from channel_connections cc 
    where cc.id = channel_products.connection_id 
    and cc.user_id = auth.uid()
  )
);

-- Product links: user can only see their own
create policy "Users can view own links" on product_links for select using (auth.uid() = user_id);
create policy "Users can insert own links" on product_links for insert with check (auth.uid() = user_id);
create policy "Users can update own links" on product_links for update using (auth.uid() = user_id);
create policy "Users can delete own links" on product_links for delete using (auth.uid() = user_id);

-- Link targets: user can only see targets from their links
create policy "Users can view own targets" on link_targets for select using (
  exists (
    select 1 from product_links pl 
    where pl.id = link_targets.link_id 
    and pl.user_id = auth.uid()
  )
);

-- Sync logs: user can only see their own
create policy "Users can view own logs" on sync_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on sync_logs for insert with check (auth.uid() = user_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
