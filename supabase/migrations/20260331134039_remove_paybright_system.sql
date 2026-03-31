/*
  # Remove PayBright Payment System

  This migration removes all PayBright-related tables and functions from the database.
  We are consolidating to use Stripe as the sole payment processor.

  ## Tables Dropped
  - `paybright_transactions` - PayBright transaction records
  - `paybright_refunds` - PayBright refund records
  - `paybright_webhooks` - PayBright webhook event logs

  ## Functions Dropped
  - Any PayBright-related functions

  ## Notes
  - This is a destructive operation that will remove all PayBright payment history
  - Ensure you have backed up any necessary PayBright transaction data before running
  - All future payments will use Stripe exclusively
*/

-- Drop PayBright tables if they exist
DROP TABLE IF EXISTS paybright_webhooks CASCADE;
DROP TABLE IF EXISTS paybright_refunds CASCADE;
DROP TABLE IF EXISTS paybright_transactions CASCADE;

-- Drop any PayBright-related functions
DROP FUNCTION IF EXISTS process_paybright_payment(jsonb) CASCADE;
DROP FUNCTION IF EXISTS handle_paybright_webhook(jsonb) CASCADE;
DROP FUNCTION IF EXISTS process_paybright_refund(uuid, numeric) CASCADE;

-- Drop any PayBright-related types
DROP TYPE IF EXISTS paybright_transaction_status CASCADE;
DROP TYPE IF EXISTS paybright_refund_status CASCADE;
