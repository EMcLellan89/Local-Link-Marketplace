/*
  # AI Assistant Conversations System

  1. New Tables
    - `ai_assistant_conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `assistant_type` (text) - quote, review, social, email, ad_copy
      - `messages` (jsonb) - conversation history
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `ai_assistant_conversations` table
    - Add policy for authenticated users to manage their own conversations
*/

CREATE TABLE IF NOT EXISTS ai_assistant_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assistant_type text NOT NULL CHECK (assistant_type IN ('quote', 'review', 'social', 'email', 'ad_copy')),
  messages jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_user_id ON ai_assistant_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_assistant_type ON ai_assistant_conversations(assistant_type);
CREATE INDEX IF NOT EXISTS idx_ai_assistant_conversations_created_at ON ai_assistant_conversations(created_at DESC);

ALTER TABLE ai_assistant_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI conversations"
  ON ai_assistant_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own AI conversations"
  ON ai_assistant_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI conversations"
  ON ai_assistant_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI conversations"
  ON ai_assistant_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
