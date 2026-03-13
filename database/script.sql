CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  original_filename TEXT,
  file_path TEXT,
  content TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  CHECK (ended_at > started_at)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  topic TEXT,
  quiz_type TEXT CHECK (quiz_type IN ('mcq', 'short')),
  questions_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers_json JSONB,
  score INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  feedback_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS study_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('High','Medium','Low')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  score_percent INT NULL CHECK (score_percent BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO subjects (name) VALUES ('Math') ON CONFLICT DO NOTHING;
INSERT INTO subjects (name) VALUES ('Physics') ON CONFLICT DO NOTHING;
INSERT INTO subjects (name) VALUES ('Chemistry') ON CONFLICT DO NOTHING;

INSERT INTO study_sessions (user_id, started_at, ended_at)
VALUES (
  (SELECT id FROM users ORDER BY created_at DESC LIMIT 1),
  now() - interval '1 hour',
  now()
);

INSERT INTO activities (user_id, label, score_percent)
VALUES (
  (SELECT id FROM users ORDER BY created_at DESC LIMIT 1),
  'Completed Math Quiz',
  92
);

ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS note_id UUID REFERENCES notes(id) ON DELETE SET NULL;

ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS topic TEXT;

ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS quiz_type TEXT CHECK (quiz_type IN ('mcq','short'));

ALTER TABLE quizzes
ADD COLUMN IF NOT EXISTS questions_json JSONB;

So the DB needs those columns.

Run this in Postgres:

ALTER TABLE notes
ADD COLUMN IF NOT EXISTS original_filename TEXT,
ADD COLUMN IF NOT EXISTS file_path TEXT;

Then verify:

ALTER TABLE quiz_attempts
ALTER COLUMN score_percent SET DEFAULT 0;

ALTER TABLE quiz_attempts
ALTER COLUMN score_percent DROP NOT NULL;