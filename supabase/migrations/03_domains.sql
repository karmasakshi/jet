-- public.amount

create domain public.amount as numeric(15, 2)
  check (value >= 0);

-- public.count

create domain public.count as smallint
  check (value > 0);

-- public.email

create domain public.email as text
  check (length(value) <= 60 and value ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');

-- public.gender

create domain public.gender as text
  check (value in ('female', 'male', 'other'));

-- public.latitude

create domain public.latitude as double precision
  check (value between -90 and 90);

-- public.longitude

create domain public.longitude as double precision
  check (value between -180 and 180);

-- public.name

create domain public.name as text
  check (length(value) between 1 and 60);

-- public.percentage

create domain public.percentage as numeric(5, 2)
  check (value between 0 and 100);

-- public.phone

create domain public.phone as text
  check (value ~ '^\+[1-9][0-9]{7,14}$');

-- public.slug

create domain public.slug as text
  check (length(value) between 3 and 60 and value ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$');

-- public.url

create domain public.url as text
  check (length(value) between 10 and 600 and value ~ '^https?://[^\s]+$');

-- public.username

create domain public.username as text
  check (length(value) between 3 and 36 and value ~ '^[a-z0-9_]+$');
