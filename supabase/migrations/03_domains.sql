-- shared.amount

create domain shared.amount as numeric(15, 2)
  check (value >= 0);

-- shared.area_sq_ft

create domain shared.area_sq_ft as numeric(10, 2)
  check (value > 0);

-- shared.code

create domain shared.code as text
  check (
    length(value) between 1 and 30
    and value = upper(value)
    and value ~ '^[A-Z0-9]+([/-][A-Z0-9]+)*$'
  );

-- shared.count

create domain shared.count as smallint
  check (value > 0);

-- shared.country_iso_code

create domain shared.country_iso_code as text
  check (length(value) = 2 and value = upper(value));

-- shared.currency_iso_code

create domain shared.currency_iso_code as text
  check (length(value) = 3 and value = upper(value));

-- shared.email_address

create domain shared.email_address as text
  check (
    length(value) <= 60
    and value ~ '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
  );

-- shared.gender

create domain shared.gender as text
  check (value in ('female', 'male', 'other'));

-- shared.iban

create domain shared.iban as text
  check (
    length(value) between 15 and 34
    and value = upper(value)
    and value ~ '^[A-Z0-9]+$'
  );

-- shared.latitude

create domain shared.latitude as double precision
  check (value between -90 and 90);

-- shared.longitude

create domain shared.longitude as double precision
  check (value between -180 and 180);

-- shared.name

create domain shared.name as text
  check (length(value) between 1 and 60);

-- shared.orientation_degrees

create domain shared.orientation_degrees as smallint
  check (value between 0 and 359);

-- shared.path

create domain shared.path as text
  check (
    length(value) <= 300
    and value ~ '^\/(?!.*(\.\.|%2e%2e|%2E%2E))[^#\s]+(\?[^#\s]+)?$'
  );

-- shared.percentage

create domain shared.percentage as numeric(5, 2)
  check (value between 0 and 100);

-- shared.phone_number

create domain shared.phone_number as text
  check (value ~ '^\+[1-9][0-9]{7,14}$');

-- shared.slug

create domain shared.slug as text
  check (
    length(value) between 3 and 60
    and value ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'
  );

-- shared.swift_code

create domain shared.swift_code as text
  check (
    length(value) between 8 and 11
    and value = upper(value)
    and value ~ '^[A-Z0-9]+$'
  );

-- shared.url

create domain shared.url as text
  check (length(value) between 10 and 600 and value ~ '^https?://[^\s]+$');

-- shared.value_type

create domain shared.value_type as text
  check (value in ('fixed', 'percentage'));
