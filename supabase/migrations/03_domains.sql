-- shared.amount

create domain shared.amount as numeric(15, 2)
  check (value between 0 and 1_000_000_000_000);

-- shared.email_address

create domain shared.email_address as text
  check (
    length(value) <= 60
    and value ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  );

-- shared.percentage

create domain shared.percentage as numeric(5, 2)
  check (value between 0 and 100);

-- shared.phone_number

create domain shared.phone_number as text
  check (value ~ '^\+[0-9]{7,15}$');

-- shared.slug

create domain shared.slug as text
  check (
    length(value) between 3 and 60
    and value ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'
  );

-- shared.url

create domain shared.url as text
  check (length(value) between 10 and 600 and value ~ '^https?://[^\s]+$');
