/*
  # Move pg_net extension to extensions schema

  ## Summary
  Moves the pg_net extension from the public schema to the extensions schema
  to follow security best practices. Extensions should not reside in the public
  schema as they can expose internal functions to all users.

  ## Changes
  - Drops pg_net from public schema
  - Re-creates pg_net in the extensions schema
*/

DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
