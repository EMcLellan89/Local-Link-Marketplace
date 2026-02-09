/*
  # Optimize Auth RLS Performance - AI Tables

  1. Performance Optimization
    - Wrap auth.uid() in SELECT subquery for AI assistant and bot tables
    - ai_assistant_conversations uses user_id directly
    - ai_bot_setups uses merchant_id

  2. Security
    - Maintains existing security model
    - Improves query performance by caching auth.uid() result
*/

-- ai_assistant_conversations (uses user_id directly)
DROP POLICY IF EXISTS "Users can view own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can view own AI conversations"
  ON ai_assistant_conversations
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can create own AI conversations"
  ON ai_assistant_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can update own AI conversations"
  ON ai_assistant_conversations
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own AI conversations" ON ai_assistant_conversations;
CREATE POLICY "Users can delete own AI conversations"
  ON ai_assistant_conversations
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ai_bot_setups (uses merchant_id)
DROP POLICY IF EXISTS "Merchants can create own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can create own bot setups"
  ON ai_bot_setups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Merchants can update own bot setups" ON ai_bot_setups;
CREATE POLICY "Merchants can update own bot setups"
  ON ai_bot_setups
  FOR UPDATE
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Check for SELECT policy
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ai_bot_setups' 
      AND policyname = 'Merchants can view own bot setups'
  ) THEN
    DROP POLICY "Merchants can view own bot setups" ON ai_bot_setups;
    CREATE POLICY "Merchants can view own bot setups"
      ON ai_bot_setups
      FOR SELECT
      TO authenticated
      USING (
        merchant_id IN (
          SELECT id FROM merchants 
          WHERE user_id = (SELECT auth.uid())
        )
      );
  END IF;
END $$;
