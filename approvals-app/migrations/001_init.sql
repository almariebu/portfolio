create table users (
  id serial primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null check (role in ('encoder', 'dean', 'registrar', 'finance'))
);

create table enrollments (
  id serial primary key,
  student_name text not null check (length(trim(student_name)) > 0),
  units integer not null check (units between 1 and 24),
  fee_cents integer not null check (fee_cents >= 0),
  paid_cents integer not null default 0 check (paid_cents >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'dean', 'registrar', 'finance', 'enrolled')),
  created_by integer not null references users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table enrollment_events (
  id serial primary key,
  enrollment_id integer not null references enrollments (id),
  actor_id integer not null references users (id),
  action text not null,
  from_status text not null,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index enrollment_events_enrollment_id on enrollment_events (enrollment_id);
