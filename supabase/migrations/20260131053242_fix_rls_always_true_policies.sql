/*
  # Fix RLS Policies That Always Allow Access

  ## Security Issues Fixed
  Removes overly permissive RLS policies that bypass security:
  
  1. ai_tool_calls - Remove "System can insert tool calls" (allows public INSERT with no restrictions)
  2. bot_conversations - Remove "System can create/update conversations" (allows public INSERT/UPDATE with no restrictions)
  3. crm_bot_training_data - Remove "System can insert bot training data" (allows authenticated INSERT with no restrictions)

  ## Impact
  - Edge functions using service_role will continue to work (they bypass RLS)
  - Regular authenticated users can still view their own data via existing policies
  - Removes security holes that allowed unrestricted data insertion
*/

-- Fix ai_tool_calls table - remove public INSERT policy
DROP POLICY IF EXISTS "System can insert tool calls" ON ai_tool_calls;

-- Fix bot_conversations table - remove public INSERT/UPDATE policies
DROP POLICY IF EXISTS "System can create conversations" ON bot_conversations;
DROP POLICY IF EXISTS "System can update conversations" ON bot_conversations;

-- Fix crm_bot_training_data table - remove unrestricted INSERT policy
DROP POLICY IF EXISTS "System can insert bot training data" ON crm_bot_training_data;