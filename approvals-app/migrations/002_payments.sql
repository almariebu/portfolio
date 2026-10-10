-- One row per payment. The (enrollment_id, reference) pair is unique, so a
-- retried request with the same receipt reference cannot be counted twice.
create table payments (
  id serial primary key,
  enrollment_id integer not null references enrollments (id),
  reference text not null check (length(trim(reference)) > 0),
  amount_cents integer not null check (amount_cents > 0),
  created_by integer not null references users (id),
  created_at timestamptz not null default now(),
  unique (enrollment_id, reference)
);
