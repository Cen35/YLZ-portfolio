create table if not exists public.ylz_portfolio_projects (
  id text primary key,
  name text not null,
  description text not null default '',
  introduction text not null default '',
  url text not null default '',
  tags jsonb not null default '[]'::jsonb,
  cover text not null default '',
  cover_name text not null default '',
  images jsonb not null default '[]'::jsonb,
  image_names jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.ylz_portfolio_about (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.ylz_portfolio_about enable row level security;
revoke all on table public.ylz_portfolio_about from anon, authenticated;
grant select on table public.ylz_portfolio_about to anon, authenticated;
grant insert, update, delete on table public.ylz_portfolio_about to authenticated;

do $policy$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='ylz_portfolio_about'
      and policyname='portfolio about is publicly readable'
  ) then
    execute 'create policy "portfolio about is publicly readable" on public.ylz_portfolio_about for select to anon, authenticated using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='ylz_portfolio_about'
      and policyname='authenticated users manage portfolio about'
  ) then
    execute 'create policy "authenticated users manage portfolio about" on public.ylz_portfolio_about for all to authenticated using (true) with check (true)';
  end if;
end
$policy$;

alter table public.ylz_portfolio_projects enable row level security;
revoke all on table public.ylz_portfolio_projects from anon, authenticated;
grant select on table public.ylz_portfolio_projects to anon, authenticated;
grant insert, update, delete on table public.ylz_portfolio_projects to authenticated;

do $policy$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='ylz_portfolio_projects'
      and policyname='portfolio projects are publicly readable'
  ) then
    execute 'create policy "portfolio projects are publicly readable" on public.ylz_portfolio_projects for select to anon, authenticated using (true)';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='ylz_portfolio_projects'
      and policyname='authenticated users manage portfolio projects'
  ) then
    execute 'create policy "authenticated users manage portfolio projects" on public.ylz_portfolio_projects for all to authenticated using (true) with check (true)';
  end if;
end
$policy$;

insert into storage.buckets (id,name,public)
values ('project-images','project-images',true)
on conflict (id) do update set public=excluded.public;

do $policy$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and policyname='portfolio images are publicly readable'
  ) then
    execute 'create policy "portfolio images are publicly readable" on storage.objects for select to public using (bucket_id=''project-images'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and policyname='authenticated users upload portfolio images'
  ) then
    execute 'create policy "authenticated users upload portfolio images" on storage.objects for insert to authenticated with check (bucket_id=''project-images'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and policyname='authenticated users update portfolio images'
  ) then
    execute 'create policy "authenticated users update portfolio images" on storage.objects for update to authenticated using (bucket_id=''project-images'') with check (bucket_id=''project-images'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and policyname='authenticated users delete portfolio images'
  ) then
    execute 'create policy "authenticated users delete portfolio images" on storage.objects for delete to authenticated using (bucket_id=''project-images'')';
  end if;
end
$policy$;
