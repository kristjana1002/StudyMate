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

ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS answers_json JSONB,
ADD COLUMN IF NOT EXISTS score INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS feedback_json JSONB;