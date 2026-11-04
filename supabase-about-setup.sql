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
