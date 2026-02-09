/*
  # Add Missing Foreign Key Indexes - Batch 9: Admin & Miscellaneous

  1. Changes
    - Add indexes for appointments (customer_id)
    - Add indexes for admin_sessions (admin_user_id)
    - Add indexes for swipe_file_favorites (template_id)
    - Add indexes for merchant_orders (merchant_id)
    - Add indexes for loyalty_contract_uploads (merchant_id)
    - Add indexes for audit_logs (actor_user_id)
    - Add indexes for merchant_addon_subscriptions (merchant_id, addon_id)
    
  2. Rationale
    - Admin operations require efficient lookups
    - Appointment management needs fast customer queries
    
  3. Performance Impact
    - Faster admin dashboard operations
    - Better appointment booking performance
    - Improved order tracking
*/

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);

-- Admin Sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);

-- Swipe File Favorites
CREATE INDEX IF NOT EXISTS idx_swipe_file_favorites_template_id ON swipe_file_favorites(template_id);

-- Merchant Orders
CREATE INDEX IF NOT EXISTS idx_merchant_orders_merchant_id ON merchant_orders(merchant_id);

-- Loyalty Contract Uploads
CREATE INDEX IF NOT EXISTS idx_loyalty_contract_uploads_merchant_id ON loyalty_contract_uploads(merchant_id);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);

-- Merchant Addon Subscriptions
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_merchant_id ON merchant_addon_subscriptions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_addon_subscriptions_addon_id ON merchant_addon_subscriptions(addon_id);
