-- disable pg_graphql

drop extension if exists pg_graphql;

-- disable pg_net

drop extension if exists pg_net;
drop schema net;

-- enable moddatetime

create extension if not exists moddatetime schema extensions;
