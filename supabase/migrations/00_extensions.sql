-- disable pg_graphql

drop extension if exists pg_graphql;

-- enable moddatetime

create extension if not exists moddatetime schema extensions;
