-- Vidya AI production database schema for Supabase/PostgreSQL.
create extension if not exists pgcrypto;

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  name text not null,
  class_name text,
  section text,
  profile_photo text,
  parent_mobile text,
  created_at timestamptz default now()
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  subject_id uuid references subjects(id),
  class_date date not null,
  present boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists documents (
  id uuid primary key,
  name text not null,
  type text not null,
  subject text,
  class_name text,
  chapter text,
  topic text,
  content text not null,
  uploaded_by text,
  previous_class_content boolean default false,
  uploaded_at timestamptz default now()
);

create table if not exists quizzes (
  id bigint primary key,
  type text not null,
  text text not null,
  answer text,
  marks integer default 1,
  source text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id bigint references quizzes(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  score numeric,
  submitted_at timestamptz default now()
);

create table if not exists teacher_complaints (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  title text not null,
  description text,
  priority text check (priority in ('Low','Medium','High')),
  teacher_name text,
  created_at timestamptz default now()
);

create table if not exists teacher_appreciation (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  type text not null,
  text text not null,
  teacher_name text,
  created_at timestamptz default now()
);

create table if not exists parent_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  text text not null,
  status text default 'Delivered',
  created_at timestamptz default now()
);

create table if not exists meeting_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  meeting_date date not null,
  meeting_time text not null,
  status text default 'Requested',
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  title text not null,
  body text,
  type text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table students enable row level security;
alter table subjects enable row level security;
alter table attendance_records enable row level security;
alter table documents enable row level security;
alter table quizzes enable row level security;
alter table quiz_attempts enable row level security;
alter table teacher_complaints enable row level security;
alter table teacher_appreciation enable row level security;
alter table parent_messages enable row level security;
alter table meeting_requests enable row level security;
alter table notifications enable row level security;

-- The Node backend uses the Supabase service-role key and therefore bypasses RLS.
-- Add user-facing policies after connecting Supabase Auth for production deployment.
