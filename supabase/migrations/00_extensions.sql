-- disable pg_graphql

drop extension if exists pg_graphql;

-- disable pg_net

drop extension if exists pg_net;

-- enable moddatetime

create extension if not exists moddatetime schema extensions;

-- enable pg_jsonschema

create extension pg_jsonschema with schema extensions;
