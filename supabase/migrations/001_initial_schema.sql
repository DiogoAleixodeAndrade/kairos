create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.physical_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  birth_date date,
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric(5,2),
  current_weight_kg numeric(6,2),
  target_weight_kg numeric(6,2),
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  training_experience text,
  dietary_preference text,
  dietary_restrictions text,
  medical_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  main_goal text not null check (
    main_goal in (
      'fat_loss',
      'muscle_gain',
      'body_recomposition',
      'maintenance',
      'performance',
      'better_habits',
      'better_sleep'
    )
  ),
  goal_description text,
  start_date date not null default current_date,
  target_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  calories_kcal integer not null default 0,
  protein_g numeric(7,2) not null default 0,
  carbs_g numeric(7,2) not null default 0,
  fat_g numeric(7,2) not null default 0,
  water_ml integer not null default 0,
  valid_from date not null default current_date,
  valid_until date,
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  brand text,
  serving_size_g numeric(8,2),
  calories_kcal numeric(8,2) not null default 0,
  protein_g numeric(8,2) not null default 0,
  carbs_g numeric(8,2) not null default 0,
  fat_g numeric(8,2) not null default 0,
  fiber_g numeric(8,2) not null default 0,
  sodium_mg numeric(8,2) not null default 0,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_type text not null check (
    meal_type in ('breakfast', 'lunch', 'snack', 'dinner', 'supper', 'other')
  ),
  title text not null,
  eaten_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meal_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_id uuid references public.foods(id) on delete set null,
  food_name text not null,
  quantity_g numeric(8,2) not null default 0,
  calories_kcal numeric(8,2) not null default 0,
  protein_g numeric(8,2) not null default 0,
  carbs_g numeric(8,2) not null default 0,
  fat_g numeric(8,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_ml integer not null check (amount_ml > 0),
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  goal text,
  weekly_frequency integer,
  is_active boolean not null default true,
  created_by text not null default 'ai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  muscle_group text,
  equipment text,
  instructions text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_plan_id uuid references public.workout_plans(id) on delete set null,
  title text not null,
  workout_type text not null check (
    workout_type in ('strength', 'running', 'walking', 'hiit', 'functional', 'fight', 'cardio', 'other')
  ),
  scheduled_for date,
  started_at timestamptz,
  finished_at timestamptz,
  duration_minutes integer,
  estimated_calories_burned integer,
  notes text,
  status text not null default 'planned' check (status in ('planned', 'completed', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_name text not null,
  order_index integer not null default 0,
  target_sets integer,
  target_reps text,
  target_weight_kg numeric(7,2),
  rest_seconds integer,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number integer not null,
  reps integer,
  weight_kg numeric(7,2),
  distance_km numeric(7,2),
  duration_seconds integer,
  perceived_effort integer check (perceived_effort between 1 and 10),
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slept_at timestamptz not null,
  woke_up_at timestamptz not null,
  duration_minutes integer,
  quality_score integer check (quality_score between 1 and 10),
  interruptions integer not null default 0,
  energy_score integer check (energy_score between 1 and 10),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  weight_kg numeric(6,2) not null,
  logged_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  measured_at date not null default current_date,
  neck_cm numeric(6,2),
  chest_cm numeric(6,2),
  waist_cm numeric(6,2),
  abdomen_cm numeric(6,2),
  hip_cm numeric(6,2),
  arm_cm numeric(6,2),
  thigh_cm numeric(6,2),
  calf_cm numeric(6,2),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  photo_url text not null,
  photo_path text not null,
  photo_type text not null check (photo_type in ('front', 'side', 'back', 'free')),
  taken_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  report_date date not null default current_date,
  title text not null,
  summary text not null,
  positives jsonb not null default '[]'::jsonb,
  attention_points jsonb not null default '[]'::jsonb,
  recommendation text,
  consistency_score integer check (consistency_score between 0 and 100),
  status text not null default 'generated' check (status in ('draft', 'generated', 'archived')),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Nova conversa',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_levels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  level integer not null default 1,
  total_xp integer not null default 0,
  current_level_xp integer not null default 0,
  next_level_xp integer not null default 1000,
  title text not null default 'Kairos Disciple',
  updated_at timestamptz not null default now()
);

create table if not exists public.xp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  xp_reward integer not null default 0,
  icon_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  theme text not null default 'dark',
  notifications_enabled boolean not null default true,
  water_reminders_enabled boolean not null default true,
  workout_reminders_enabled boolean not null default true,
  sleep_reminders_enabled boolean not null default true,
  preferred_units text not null default 'metric',
  language text not null default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_physical_profiles_updated_at on public.physical_profiles;
create trigger set_physical_profiles_updated_at
before update on public.physical_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

drop trigger if exists set_foods_updated_at on public.foods;
create trigger set_foods_updated_at
before update on public.foods
for each row execute function public.set_updated_at();

drop trigger if exists set_meals_updated_at on public.meals;
create trigger set_meals_updated_at
before update on public.meals
for each row execute function public.set_updated_at();

drop trigger if exists set_workout_plans_updated_at on public.workout_plans;
create trigger set_workout_plans_updated_at
before update on public.workout_plans
for each row execute function public.set_updated_at();

drop trigger if exists set_exercises_updated_at on public.exercises;
create trigger set_exercises_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

drop trigger if exists set_workouts_updated_at on public.workouts;
create trigger set_workouts_updated_at
before update on public.workouts
for each row execute function public.set_updated_at();

drop trigger if exists set_ai_conversations_updated_at on public.ai_conversations;
create trigger set_ai_conversations_updated_at
before update on public.ai_conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    new.email
  )
  on conflict (id) do nothing;

  insert into public.user_levels (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.physical_profiles enable row level security;
alter table public.goals enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.foods enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.water_logs enable row level security;
alter table public.workout_plans enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.body_measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.ai_reports enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.user_levels enable row level security;
alter table public.xp_logs enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.user_settings enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

drop policy if exists "physical_profiles_all_own" on public.physical_profiles;
create policy "physical_profiles_all_own" on public.physical_profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "goals_all_own" on public.goals;
create policy "goals_all_own" on public.goals
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "nutrition_targets_all_own" on public.nutrition_targets;
create policy "nutrition_targets_all_own" on public.nutrition_targets
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "foods_select_own_or_public" on public.foods;
create policy "foods_select_own_or_public" on public.foods
for select using (auth.uid() = user_id or is_public = true);

drop policy if exists "foods_insert_own" on public.foods;
create policy "foods_insert_own" on public.foods
for insert with check (auth.uid() = user_id);

drop policy if exists "foods_update_own" on public.foods;
create policy "foods_update_own" on public.foods
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "foods_delete_own" on public.foods;
create policy "foods_delete_own" on public.foods
for delete using (auth.uid() = user_id);

drop policy if exists "meals_all_own" on public.meals;
create policy "meals_all_own" on public.meals
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "meal_items_all_own" on public.meal_items;
create policy "meal_items_all_own" on public.meal_items
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "water_logs_all_own" on public.water_logs;
create policy "water_logs_all_own" on public.water_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_plans_all_own" on public.workout_plans;
create policy "workout_plans_all_own" on public.workout_plans
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "exercises_select_own_or_public" on public.exercises;
create policy "exercises_select_own_or_public" on public.exercises
for select using (auth.uid() = user_id or is_public = true);

drop policy if exists "exercises_insert_own" on public.exercises;
create policy "exercises_insert_own" on public.exercises
for insert with check (auth.uid() = user_id);

drop policy if exists "exercises_update_own" on public.exercises;
create policy "exercises_update_own" on public.exercises
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "exercises_delete_own" on public.exercises;
create policy "exercises_delete_own" on public.exercises
for delete using (auth.uid() = user_id);

drop policy if exists "workouts_all_own" on public.workouts;
create policy "workouts_all_own" on public.workouts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_exercises_all_own" on public.workout_exercises;
create policy "workout_exercises_all_own" on public.workout_exercises
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workout_logs_all_own" on public.workout_logs;
create policy "workout_logs_all_own" on public.workout_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sleep_logs_all_own" on public.sleep_logs;
create policy "sleep_logs_all_own" on public.sleep_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "weight_logs_all_own" on public.weight_logs;
create policy "weight_logs_all_own" on public.weight_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "body_measurements_all_own" on public.body_measurements;
create policy "body_measurements_all_own" on public.body_measurements
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "progress_photos_all_own" on public.progress_photos;
create policy "progress_photos_all_own" on public.progress_photos
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ai_reports_all_own" on public.ai_reports;
create policy "ai_reports_all_own" on public.ai_reports
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ai_conversations_all_own" on public.ai_conversations;
create policy "ai_conversations_all_own" on public.ai_conversations
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "ai_messages_all_own" on public.ai_messages;
create policy "ai_messages_all_own" on public.ai_messages
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_levels_select_own" on public.user_levels;
create policy "user_levels_select_own" on public.user_levels
for select using (auth.uid() = user_id);

drop policy if exists "xp_logs_select_own" on public.xp_logs;
create policy "xp_logs_select_own" on public.xp_logs
for select using (auth.uid() = user_id);

drop policy if exists "achievements_select_active" on public.achievements;
create policy "achievements_select_active" on public.achievements
for select using (is_active = true);

drop policy if exists "user_achievements_all_own" on public.user_achievements;
create policy "user_achievements_all_own" on public.user_achievements
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_settings_all_own" on public.user_settings;
create policy "user_settings_all_own" on public.user_settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.achievements (code, title, description, xp_reward, icon_name)
values
  ('first_login', 'Primeiro Kairos', 'Você iniciou sua jornada no tempo certo.', 100, 'sparkles'),
  ('first_meal', 'Primeira Refeição', 'Você registrou sua primeira refeição.', 80, 'utensils'),
  ('first_workout', 'Primeiro Treino', 'Você concluiu seu primeiro treino.', 120, 'dumbbell'),
  ('water_goal', 'Hidratação Completa', 'Você bateu sua meta diária de água.', 100, 'droplets'),
  ('seven_day_streak', 'Sete Dias de Consistência', 'Você manteve consistência por 7 dias.', 300, 'flame')
on conflict (code) do nothing;

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

drop policy if exists "progress_photos_storage_select_own" on storage.objects;
create policy "progress_photos_storage_select_own" on storage.objects
for select using (
  bucket_id = 'progress-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "progress_photos_storage_insert_own" on storage.objects;
create policy "progress_photos_storage_insert_own" on storage.objects
for insert with check (
  bucket_id = 'progress-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "progress_photos_storage_update_own" on storage.objects;
create policy "progress_photos_storage_update_own" on storage.objects
for update using (
  bucket_id = 'progress-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "progress_photos_storage_delete_own" on storage.objects;
create policy "progress_photos_storage_delete_own" on storage.objects
for delete using (
  bucket_id = 'progress-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);