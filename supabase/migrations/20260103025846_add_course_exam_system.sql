/*
  # Add Course Exam System

  1. New Tables
    - `course_exam_questions`
      - Stores exam questions for each course
      - Supports MCQ and scenario questions
      - Includes correct answers and explanations
    - `course_exam_attempts`
      - Tracks user exam attempts
      - Stores score, pass/fail status, and submitted answers
      - One attempt per user per course (unique constraint)

  2. Security
    - Enable RLS on both tables
    - Questions readable by all (public)
    - Attempts readable only by the user who submitted them
*/

-- Exam Questions Table
create table if not exists public.course_exam_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  question_index int not null,
  question_text text not null,
  question_type text not null default 'mcq',
  options jsonb,
  correct_option_id text,
  explanation text,
  created_at timestamptz not null default now(),
  unique(course_id, question_index)
);

-- Exam Attempts Table
create table if not exists public.course_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null default 0,
  passed boolean not null default false,
  answers jsonb,
  submitted_at timestamptz not null default now(),
  unique(course_id, user_id)
);

-- Enable RLS
alter table public.course_exam_questions enable row level security;
alter table public.course_exam_attempts enable row level security;

-- RLS Policies
create policy "Exam questions are publicly readable"
  on public.course_exam_questions
  for select
  to authenticated
  using (true);

create policy "Users can read their own exam attempts"
  on public.course_exam_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_exam_questions_course on public.course_exam_questions(course_id);
create index if not exists idx_exam_attempts_course_user on public.course_exam_attempts(course_id, user_id);
