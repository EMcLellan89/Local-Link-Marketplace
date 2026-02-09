/*
  # Drop Duplicate Indexes
  
  Removes duplicate indexes that are identical to each other,
  keeping only one copy of each.
*/

-- dfy_fulfillment_tasks - keep idx_dfy_fulfillment_tasks_order_id
DROP INDEX IF EXISTS idx_dfy_fulfillment_tasks_order;

-- enrollments - keep idx_enrollments_course_id
DROP INDEX IF EXISTS idx_enrollments_course;

-- lesson_progress - keep idx_lesson_progress_lesson_id
DROP INDEX IF EXISTS idx_lesson_progress_lesson;

-- ugc_orders - keep idx_ugc_orders_merchant_id
DROP INDEX IF EXISTS idx_ugc_orders_merchant;

-- user_entitlements - keep idx_user_entitlements_course_id
DROP INDEX IF EXISTS idx_user_entitlements_course;
