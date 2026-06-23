alter table public.physical_profiles
add column if not exists journey_mode text not null default 'from_scratch'
check (journey_mode in ('from_scratch', 'with_history'));

alter table public.physical_profiles
add column if not exists journey_start_date date;

alter table public.physical_profiles
add column if not exists journey_start_weight_kg numeric(6,2);

alter table public.physical_profiles
add column if not exists journey_current_weight_kg numeric(6,2);

alter table public.physical_profiles
add column if not exists journey_notes text;