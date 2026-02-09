/*
  # Fix Missing Foreign Key Indexes - Batch 4 (Cart, Certificates, Communications, Community)
  
  1. Performance
    - Add indexes on all unindexed foreign keys
  
  2. Tables Updated
    - cart_items
    - certificates
    - certificates_issued
    - commissions
    - communications_subscriptions
    - communications_transactions
    - community_sponsorships
    - course tables
*/

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_user_id ON certificates_issued(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_communications_subscriptions_product_id ON communications_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_call_log_id ON communications_transactions(call_log_id);
CREATE INDEX IF NOT EXISTS idx_communications_transactions_sms_log_id ON communications_transactions(sms_log_id);
CREATE INDEX IF NOT EXISTS idx_community_sponsorships_merchant_id ON community_sponsorships(merchant_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_payouts_affiliate_id ON course_affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_affiliate_id ON course_affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_order_id ON course_affiliate_referrals(order_id);
CREATE INDEX IF NOT EXISTS idx_course_affiliate_referrals_referred_user_id ON course_affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_course_exam_attempts_user_id ON course_exam_attempts(user_id);
