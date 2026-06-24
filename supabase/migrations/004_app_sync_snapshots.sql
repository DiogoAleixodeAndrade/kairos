create table if not exists public.app_sync_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_sync_snapshots enable row level security;

drop policy if exists "Users can select own sync snapshot" on public.app_sync_snapshots;
create policy "Users can select own sync snapshot"
on public.app_sync_snapshots
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own sync snapshot" on public.app_sync_snapshots;
create policy "Users can insert own sync snapshot"
on public.app_sync_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own sync snapshot" on public.app_sync_snapshots;
create policy "Users can update own sync snapshot"
on public.app_sync_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop trigger if exists set_app_sync_snapshots_updated_at on public.app_sync_snapshots;

create trigger set_app_sync_snapshots_updated_at
before update on public.app_sync_snapshots
for each row
execute function public.set_updated_at();