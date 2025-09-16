/*
  # Create teachers table

  1. New Tables
    - `teachers`
      - `id` (text, primary key)
      - `name` (text)
      - `title` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `teachers` table
    - Add policy for authenticated users to manage teachers
*/

CREATE TABLE IF NOT EXISTS teachers (
  id text PRIMARY KEY,
  name text NOT NULL,
  title text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON teachers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);