-- What's Your Drink — Supabase tables (all names end in _dk).
-- Same structure as the original 2026-09-22 schema, renamed so this app never collides with other
-- services in the shared project (euhuiktqoslmndozqpsr). Safe to re-run.

create table if not exists public.questions_dk (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  display_order int,
  text text,
  text_align text not null default 'center' check (text_align in ('left','center','right')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.question_options_dk (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions_dk(id) on delete cascade,
  code text,
  display_order int,
  label text,
  result_type text,
  weight int default 1,
  unique (question_id, code)
);

create table if not exists public.result_types_dk (
  id uuid primary key default gen_random_uuid(),
  type text unique,
  display_name text,
  tie_break_priority int,
  personality_title text,
  about_you text,
  notes text[],
  scent_description text,
  why_it_fits text,
  recommended_for text
);

create table if not exists public.branding_dk (
  id int primary key default 1,
  cover_brand text,
  cover_title text,
  cover_subtitle text,
  next_button text,
  share_button text,
  scent_button text,
  scent_caption text,
  share_template text,
  qr_url text,
  check (id = 1)
);

create table if not exists public.submissions_dk (
  id uuid primary key default gen_random_uuid(),
  answers jsonb,
  result_type text,
  shared boolean default false,
  shared_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.referral_visits_dk (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.submissions_dk(id) on delete set null,
  visited_at timestamptz default now(),
  user_agent text
);

create table if not exists public.translations_dk (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  locale text not null check (locale in ('en','vi')),
  field_key text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id, locale, field_key)
);

-- Same access as before: the site (publishable key, browser) reads and writes directly.
do $$
declare t text;
begin
  foreach t in array array['questions_dk','question_options_dk','result_types_dk','branding_dk','submissions_dk','referral_visits_dk','translations_dk']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_read', t);
    execute format('create policy %I on public.%I for select using (true)', t || '_read', t);
    execute format('drop policy if exists %I on public.%I', t || '_write', t);
    execute format('create policy %I on public.%I for all using (true) with check (true)', t || '_write', t);
    execute format('grant all on public.%I to anon, authenticated, service_role', t);
  end loop;
end $$;
