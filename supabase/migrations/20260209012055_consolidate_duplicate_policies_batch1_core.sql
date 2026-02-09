/*
  # Consolidate Duplicate RLS Policies - Batch 1
  
  This migration removes duplicate policies that have different names
  but serve the same purpose for the same role.
  
  ## Tables Updated
  - affiliate_partners (remove duplicate SELECT policy)
  - affiliate_referrals (remove duplicate SELECT policy)
  - ai_assistant_conversations (remove duplicate policies)
  - communications_transactions (remove duplicate SELECT policy)
  
  ## Security Impact
  - Maintains existing security model
  - Improves policy evaluation performance
  - Simplifies security model
*/

-- affiliate_partners: Remove duplicate SELECT policy
DROP POLICY IF EXISTS "Partners can read their own profile" ON affiliate_partners;
-- Keep: "Partners can view own affiliate data"

-- affiliate_referrals: Remove duplicate SELECT policy  
DROP POLICY IF EXISTS "Partners can read their own referrals" ON affiliate_referrals;
-- Keep: "Partners can view own referrals"

-- ai_assistant_conversations: Remove duplicate policies
-- Keep the newer "Users can..." versions
DROP POLICY IF EXISTS "Users can view own AI conversations" ON ai_assistant_conversations;
DROP POLICY IF EXISTS "Users can create own AI conversations" ON ai_assistant_conversations;
DROP POLICY IF EXISTS "Users can update own AI conversations" ON ai_assistant_conversations;
-- Keep: Users can view/create/update own conversations

-- communications_transactions: Remove duplicate SELECT policy
DROP POLICY IF EXISTS "Merchants can view own communications transactions" ON communications_transactions;
-- Keep: "Merchants can view own transactions"
