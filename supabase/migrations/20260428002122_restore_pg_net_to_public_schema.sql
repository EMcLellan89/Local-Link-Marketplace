/*
  # Restore pg_net to public schema

  ## Summary
  Restores pg_net back to the public schema so that net.http_post() calls
  from pg_cron scheduled jobs continue to work correctly.

  The cron jobs use net.http_post() — functions in the net schema that pg_net
  creates. The extension must be installed with its default schema (net) which
  it creates automatically.
*/

DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net;
