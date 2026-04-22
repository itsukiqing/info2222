create table if not exists public.chat_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  leader_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.chat_groups add column if not exists leader_id uuid references auth.users(id) on delete set null;
update public.chat_groups set leader_id = created_by where leader_id is null;

create table if not exists public.chat_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.chat_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table if not exists public.chat_channels (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.chat_groups(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.chat_groups(id) on delete cascade,
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_group_member_profiles (
  group_id uuid not null references public.chat_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text,
  current_task text,
  stage text,
  workload text,
  deadline date,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.chat_group_member_availability (
  group_id uuid not null references public.chat_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  day_name text not null,
  slots text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (group_id, user_id, day_name)
);

alter table public.chat_groups enable row level security;
alter table public.chat_group_members enable row level security;
alter table public.chat_channels enable row level security;
alter table public.chat_messages enable row level security;

create or replace function public.is_chat_group_member(target_group_id uuid, target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.chat_group_members
    where chat_group_members.group_id = target_group_id
      and chat_group_members.user_id = target_user_id
  );
$$;

create or replace function public.can_manage_chat_group(target_group_id uuid, target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.chat_groups
    where chat_groups.id = target_group_id
      and (
        chat_groups.created_by = target_user_id
        or coalesce(chat_groups.leader_id, chat_groups.created_by) = target_user_id
      )
  );
$$;

drop policy if exists "Authenticated users can read chat groups" on public.chat_groups;
drop policy if exists "Authenticated users can create chat groups" on public.chat_groups;
drop policy if exists "Authenticated users can read chat channels" on public.chat_channels;
drop policy if exists "Authenticated users can create chat channels" on public.chat_channels;
drop policy if exists "Authenticated users can read chat messages" on public.chat_messages;
drop policy if exists "Authenticated users can send chat messages" on public.chat_messages;
drop policy if exists "Members can read chat groups" on public.chat_groups;
drop policy if exists "Authenticated users can create chat groups" on public.chat_groups;
drop policy if exists "Members can read group members" on public.chat_group_members;
drop policy if exists "Creators can add group members" on public.chat_group_members;
drop policy if exists "Members can read chat channels" on public.chat_channels;
drop policy if exists "Group creators can create chat channels" on public.chat_channels;
drop policy if exists "Members can read chat messages" on public.chat_messages;
drop policy if exists "Members can send chat messages" on public.chat_messages;

create policy "Members can read chat groups"
on public.chat_groups
for select
to authenticated
using (public.is_chat_group_member(chat_groups.id, auth.uid()));

create policy "Authenticated users can create chat groups"
on public.chat_groups
for insert
to authenticated
with check (created_by = auth.uid());

create policy "Members can read group members"
on public.chat_group_members
for select
to authenticated
using (chat_group_members.user_id = auth.uid() or chat_group_members.added_by = auth.uid());

create policy "Creators can add group members"
on public.chat_group_members
for insert
to authenticated
with check (
  added_by = auth.uid()
  and exists (
    select 1
    from public.chat_groups
    where chat_groups.id = chat_group_members.group_id
      and chat_groups.created_by = auth.uid()
  )
);

create policy "Members can read chat channels"
on public.chat_channels
for select
to authenticated
using (public.is_chat_group_member(chat_channels.group_id, auth.uid()));

create policy "Group creators can create chat channels"
on public.chat_channels
for insert
to authenticated
with check (
  exists (
    select 1
    from public.chat_groups
    where chat_groups.id = chat_channels.group_id
      and chat_groups.created_by = auth.uid()
  )
);

create policy "Members can read chat messages"
on public.chat_messages
for select
to authenticated
using (public.is_chat_group_member(chat_messages.group_id, auth.uid()));

create policy "Members can send chat messages"
on public.chat_messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.is_chat_group_member(chat_messages.group_id, auth.uid())
);

create index if not exists chat_group_members_group_id_idx
on public.chat_group_members(group_id);

create index if not exists chat_group_members_user_id_idx
on public.chat_group_members(user_id);

create index if not exists chat_channels_group_id_idx
on public.chat_channels(group_id);

create index if not exists chat_messages_group_id_created_at_idx
on public.chat_messages(group_id, created_at);

create index if not exists chat_messages_channel_id_created_at_idx
on public.chat_messages(channel_id, created_at);

create index if not exists chat_group_member_profiles_group_id_idx
on public.chat_group_member_profiles(group_id);

create index if not exists chat_group_member_availability_group_id_idx
on public.chat_group_member_availability(group_id);

create or replace function public.create_chat_group(
  group_name text,
  first_channel_name text,
  member_ids uuid[]
)
returns table(group_id uuid, channel_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  creator_id uuid;
  new_group_id uuid;
  new_channel_id uuid;
begin
  creator_id := auth.uid();

  if creator_id is null then
    raise exception 'You must be signed in to create a group';
  end if;

  insert into public.chat_groups (name, created_by)
  values (group_name, creator_id)
  returning id into new_group_id;

  update public.chat_groups
  set leader_id = creator_id
  where id = new_group_id;

  insert into public.chat_group_members (group_id, user_id, added_by)
  select new_group_id, member_id, creator_id
  from (
    select distinct unnest(array_append(coalesce(member_ids, '{}'::uuid[]), creator_id)) as member_id
  ) members;

  insert into public.chat_channels (group_id, name)
  values (new_group_id, first_channel_name)
  returning id into new_channel_id;

  insert into public.chat_messages (group_id, channel_id, sender_id, sender_name, body)
  values (new_group_id, new_channel_id, creator_id, 'System', format('Welcome to %s.', group_name));

  return query
  select new_group_id, new_channel_id;
end;
$$;

grant execute on function public.create_chat_group(text, text, uuid[]) to authenticated;

create or replace function public.send_chat_message(
  target_group_id uuid,
  target_channel_id uuid,
  message_body text,
  sender_display_name text
)
returns table(message_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_sender_id uuid;
  new_message_id uuid;
  new_created_at timestamptz;
begin
  current_sender_id := auth.uid();

  if current_sender_id is null then
    raise exception 'You must be signed in to send a message';
  end if;

  if not public.is_chat_group_member(target_group_id, current_sender_id) then
    raise exception 'You are not a member of this group';
  end if;

  insert into public.chat_messages (group_id, channel_id, sender_id, sender_name, body)
  values (target_group_id, target_channel_id, current_sender_id, sender_display_name, message_body)
  returning id, chat_messages.created_at into new_message_id, new_created_at;

  return query
  select new_message_id, new_created_at;
end;
$$;

grant execute on function public.send_chat_message(uuid, uuid, text, text) to authenticated;

create or replace function public.get_my_chat_state()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  with my_group_ids as (
    select group_id
    from public.chat_group_members
    where user_id = auth.uid()
  ),
  groups_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', chat_groups.id,
          'name', chat_groups.name,
          'created_by', chat_groups.created_by,
          'leader_id', coalesce(chat_groups.leader_id, chat_groups.created_by),
          'created_at', chat_groups.created_at
        )
        order by chat_groups.created_at
      ),
      '[]'::jsonb
    ) as value
    from public.chat_groups
    where chat_groups.id in (select group_id from my_group_ids)
  ),
  channels_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', chat_channels.id,
          'group_id', chat_channels.group_id,
          'name', chat_channels.name,
          'created_at', chat_channels.created_at
        )
        order by chat_channels.created_at
      ),
      '[]'::jsonb
    ) as value
    from public.chat_channels
    where chat_channels.group_id in (select group_id from my_group_ids)
  ),
  messages_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', chat_messages.id,
          'group_id', chat_messages.group_id,
          'channel_id', chat_messages.channel_id,
          'sender_id', chat_messages.sender_id,
          'sender_name', chat_messages.sender_name,
          'body', chat_messages.body,
          'created_at', chat_messages.created_at
        )
        order by chat_messages.created_at
      ),
      '[]'::jsonb
    ) as value
    from public.chat_messages
    where chat_messages.group_id in (select group_id from my_group_ids)
  )
  select jsonb_build_object(
    'groups', (select value from groups_json),
    'channels', (select value from channels_json),
    'messages', (select value from messages_json)
  );
$$;

grant execute on function public.get_my_chat_state() to authenticated;

create or replace function public.get_chat_group_members(target_group_id uuid)
returns table(
  user_id uuid,
  username text,
  full_name text,
  email text,
  role text,
  current_task text,
  stage text,
  workload text,
  deadline date,
  is_leader boolean,
  is_creator boolean
)
language sql
security definer
set search_path = public
stable
as $$
  select
    profiles.id as user_id,
    profiles.username,
    profiles.full_name,
    profiles.email,
    coalesce(chat_group_member_profiles.role, profiles.role, 'Team member') as role,
    coalesce(chat_group_member_profiles.current_task, '') as current_task,
    coalesce(chat_group_member_profiles.stage, 'Not set') as stage,
    coalesce(chat_group_member_profiles.workload, 'Not set') as workload,
    chat_group_member_profiles.deadline,
    profiles.id = coalesce(chat_groups.leader_id, chat_groups.created_by) as is_leader,
    profiles.id = chat_groups.created_by as is_creator
  from public.chat_group_members
  join public.chat_groups
    on chat_groups.id = chat_group_members.group_id
  join public.profiles
    on profiles.id = chat_group_members.user_id
  left join public.chat_group_member_profiles
    on chat_group_member_profiles.group_id = chat_group_members.group_id
   and chat_group_member_profiles.user_id = chat_group_members.user_id
  where chat_group_members.group_id = target_group_id
    and public.is_chat_group_member(target_group_id, auth.uid())
  order by lower(coalesce(profiles.full_name, profiles.username, profiles.email));
$$;

grant execute on function public.get_chat_group_members(uuid) to authenticated;

create or replace function public.get_chat_group_availability(target_group_id uuid)
returns table(
  user_id uuid,
  day_name text,
  slots text[]
)
language sql
security definer
set search_path = public
stable
as $$
  select
    availability.user_id,
    availability.day_name,
    availability.slots
  from public.chat_group_member_availability availability
  where availability.group_id = target_group_id
    and public.is_chat_group_member(target_group_id, auth.uid());
$$;

grant execute on function public.get_chat_group_availability(uuid) to authenticated;

create or replace function public.upsert_chat_group_member_profile(
  target_group_id uuid,
  target_user_id uuid,
  member_role text,
  member_current_task text,
  member_stage text,
  member_workload text,
  member_deadline date
)
returns table(
  user_id uuid,
  username text,
  full_name text,
  email text,
  role text,
  current_task text,
  stage text,
  workload text,
  deadline date,
  is_leader boolean,
  is_creator boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_user_id uuid;
begin
  acting_user_id := auth.uid();

  if acting_user_id is null then
    raise exception 'You must be signed in to edit team members';
  end if;

  if not public.is_chat_group_member(target_group_id, acting_user_id) then
    raise exception 'You are not a member of this group';
  end if;

  if not public.is_chat_group_member(target_group_id, target_user_id) then
    raise exception 'That user is not in this group';
  end if;

  insert into public.chat_group_member_profiles (
    group_id,
    user_id,
    role,
    current_task,
    stage,
    workload,
    deadline,
    updated_by,
    updated_at
  )
  values (
    target_group_id,
    target_user_id,
    nullif(trim(member_role), ''),
    nullif(trim(member_current_task), ''),
    nullif(trim(member_stage), ''),
    nullif(trim(member_workload), ''),
    member_deadline,
    acting_user_id,
    now()
  )
  on conflict (group_id, user_id) do update
  set role = excluded.role,
      current_task = excluded.current_task,
      stage = excluded.stage,
      workload = excluded.workload,
      deadline = excluded.deadline,
      updated_by = excluded.updated_by,
      updated_at = excluded.updated_at;

  return query
  select *
  from public.get_chat_group_members(target_group_id)
  where get_chat_group_members.user_id = target_user_id;
end;
$$;

grant execute on function public.upsert_chat_group_member_profile(uuid, uuid, text, text, text, text, date) to authenticated;

create or replace function public.set_chat_group_leader(
  target_group_id uuid,
  target_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_user_id uuid;
  resolved_leader_id uuid;
begin
  acting_user_id := auth.uid();

  if acting_user_id is null then
    raise exception 'You must be signed in to update the team leader';
  end if;

  if not public.can_manage_chat_group(target_group_id, acting_user_id) then
    raise exception 'Only the team leader or creator can change the leader';
  end if;

  if not public.is_chat_group_member(target_group_id, target_user_id) then
    raise exception 'That user is not in this team';
  end if;

  update public.chat_groups
  set leader_id = target_user_id
  where id = target_group_id
  returning leader_id into resolved_leader_id;

  return resolved_leader_id;
end;
$$;

grant execute on function public.set_chat_group_leader(uuid, uuid) to authenticated;

create or replace function public.remove_chat_group_member(
  target_group_id uuid,
  target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_user_id uuid;
  creator_user_id uuid;
  current_leader_id uuid;
begin
  acting_user_id := auth.uid();

  if acting_user_id is null then
    raise exception 'You must be signed in to remove a member';
  end if;

  select created_by, coalesce(leader_id, created_by)
  into creator_user_id, current_leader_id
  from public.chat_groups
  where id = target_group_id;

  if creator_user_id is null then
    raise exception 'That team does not exist';
  end if;

  if not public.can_manage_chat_group(target_group_id, acting_user_id) then
    raise exception 'Only the team leader or creator can remove members';
  end if;

  if target_user_id = creator_user_id then
    raise exception 'The group creator cannot be removed';
  end if;

  if current_leader_id = target_user_id then
    update public.chat_groups
    set leader_id = creator_user_id
    where id = target_group_id;
  end if;

  delete from public.chat_group_member_profiles
  where group_id = target_group_id
    and user_id = target_user_id;

  delete from public.chat_group_member_availability
  where group_id = target_group_id
    and user_id = target_user_id;

  delete from public.chat_group_members
  where group_id = target_group_id
    and user_id = target_user_id;
end;
$$;

grant execute on function public.remove_chat_group_member(uuid, uuid) to authenticated;

create or replace function public.upsert_my_chat_group_availability(
  target_group_id uuid,
  target_day_name text,
  target_slots text[]
)
returns table(
  user_id uuid,
  day_name text,
  slots text[]
)
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_user_id uuid;
begin
  acting_user_id := auth.uid();

  if acting_user_id is null then
    raise exception 'You must be signed in to update availability';
  end if;

  if not public.is_chat_group_member(target_group_id, acting_user_id) then
    raise exception 'You are not a member of this team';
  end if;

  insert into public.chat_group_member_availability (
    group_id,
    user_id,
    day_name,
    slots,
    updated_at
  )
  values (
    target_group_id,
    acting_user_id,
    target_day_name,
    coalesce(target_slots, '{}'),
    now()
  )
  on conflict (group_id, user_id, day_name) do update
  set slots = excluded.slots,
      updated_at = excluded.updated_at;

  return query
  select
    availability.user_id,
    availability.day_name,
    availability.slots
  from public.chat_group_member_availability availability
  where availability.group_id = target_group_id
    and availability.user_id = acting_user_id
    and availability.day_name = target_day_name;
end;
$$;

grant execute on function public.upsert_my_chat_group_availability(uuid, text, text[]) to authenticated;

create or replace function public.add_chat_group_member_by_email(
  target_group_id uuid,
  member_email text
)
returns table(added_user_id uuid, added_email text, added_full_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  acting_user_id uuid;
  target_user_id uuid;
  target_user_email text;
  target_user_full_name text;
begin
  acting_user_id := auth.uid();

  if acting_user_id is null then
    raise exception 'You must be signed in to add members';
  end if;

  if not public.can_manage_chat_group(target_group_id, acting_user_id) then
    raise exception 'Only the team leader or creator can add members';
  end if;

  select id, email, full_name
  into target_user_id, target_user_email, target_user_full_name
  from public.profiles
  where lower(email) = lower(member_email)
  limit 1;

  if target_user_id is null then
    raise exception 'No user found with that email';
  end if;

  insert into public.chat_group_members (group_id, user_id, added_by)
  values (target_group_id, target_user_id, acting_user_id)
  on conflict (group_id, user_id) do nothing;

  return query
  select target_user_id, target_user_email, coalesce(target_user_full_name, '');
end;
$$;

grant execute on function public.add_chat_group_member_by_email(uuid, text) to authenticated;
