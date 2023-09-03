create table public.profiles(
  id uuid unique references auth.users on delete cascade, --外鍵引用auth.users, 引用刪除時連帶刪除.
  full_name text,
  updated_at timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null,
  primary key (id)
);

alter table public.profiles enable row level security; --enable profiles RLS

create policy "Users can view own profile" on profiles  --RLS
  for select to authenticated
    using (auth.uid() = id);  --SQL conditional expression(boolean),  using built-in helper function auth.uid()

create policy "Users can update own profile" on profiles
  for update to authenticated
    using (auth.uid() = id);

--auth.users插入新增資料時 連帶加入profiles.
create or replace function public.handle_new_user()
  returns trigger
  as $$
begin
  insert into public.profiles(id, full_name)
    values(new.id, new.raw_user_meta_data ->> 'full_name');--由auth.users資料變動觸發時, new為新插入列資料; raw_user_meta_data為jsonb, ->> 'full_name'為取出的prop
  return new; --對insert及update操作 必須return new, 因為這會引響後續trigger的傳入值.
end;
$$
language plpgsql
security definer;

create trigger on_auth_user_created
  after insert on auth.users for each row  --每一row改變都觸發一次trigger procedure
  execute procedure public.handle_new_user();