/*
  # Fix Auth RLS Performance - Batch 5: AI Bot Tables
  
  This migration optimizes RLS policies for AI bot-related tables.
  
  ## Tables Updated
  - ai_bot_subscriptions
  - ai_assistant_conversations
  - ai_tool_calls
  
  ## Security Impact
  - Maintains existing security model
  - Improves query performance
*/

-- ai_bot_subscriptions
DROP POLICY IF EXISTS "Users can view own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can view own bot subscriptions"
  ON ai_bot_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can create own bot subscriptions"
  ON ai_bot_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own bot subscriptions" ON ai_bot_subscriptions;
CREATE POLICY "Users can update own bot subscriptions"
  ON ai_bot_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ai_assistant_conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can view own conversations"
  ON ai_assistant_conversations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can manage own conversations"
  ON ai_assistant_conversations FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can create own conversations"
  ON ai_assistant_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can update own conversations"
  ON ai_assistant_conversations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ai_tool_calls
DROP POLICY IF EXISTS "Users can view own tool calls" ON ai_tool_calls;
CREATE POLICY "Users can view own tool calls"
  ON ai_tool_calls FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_assistant_conversations
      WHERE ai_assistant_conversations.id = ai_tool_calls.conversation_id
      AND ai_assistant_conversations.user_id = (select auth.uid())
    )
  );
