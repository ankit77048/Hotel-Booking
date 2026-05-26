
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles owner read" on public.profiles for select using (auth.uid() = id);
create policy "Profiles owner update" on public.profiles for update using (auth.uid() = id);
create policy "Profiles owner insert" on public.profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Hotels
create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  description text not null,
  image_url text not null,
  rating numeric(2,1) not null default 4.5,
  amenities text[] not null default '{}',
  price_per_night numeric(10,2) not null,
  created_at timestamptz not null default now()
);
alter table public.hotels enable row level security;
create policy "Hotels public read" on public.hotels for select using (true);

-- Rooms
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  name text not null,
  room_type text not null,
  capacity int not null default 2,
  price_per_night numeric(10,2) not null,
  image_url text not null,
  total_units int not null default 3,
  created_at timestamptz not null default now()
);
alter table public.rooms enable row level security;
create policy "Rooms public read" on public.rooms for select using (true);
create index on public.rooms(hotel_id);

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  room_id uuid not null references public.rooms(id),
  hotel_id uuid not null references public.hotels(id),
  check_in date not null,
  check_out date not null,
  guests int not null default 2,
  total_amount numeric(10,2) not null,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed')),
  transaction_id text,
  created_at timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);
alter table public.bookings enable row level security;
create policy "Bookings owner read" on public.bookings for select using (auth.uid() = user_id);
create policy "Bookings owner insert" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Bookings owner update" on public.bookings for update using (auth.uid() = user_id);
create index on public.bookings(user_id);
create index on public.bookings(room_id, check_in, check_out);
