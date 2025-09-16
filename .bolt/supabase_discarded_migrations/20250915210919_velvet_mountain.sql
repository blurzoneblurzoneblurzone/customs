/*
  # Create subjects table

  1. New Tables
    - `subjects`
      - `id` (text, primary key)
      - `name` (text)
      - `shortName` (text, nullable)
      - `type` (text, 'lecture' or 'practical')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `subjects` table
    - Add policy for authenticated users to manage subjects
*/

CREATE TABLE IF NOT EXISTS subjects (
  id text PRIMARY KEY,
  name text NOT NULL,
  shortName text,
  type text NOT NULL CHECK (type IN ('lecture', 'practical')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON subjects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);