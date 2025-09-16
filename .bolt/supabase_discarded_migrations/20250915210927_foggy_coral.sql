/*
  # Create faculty_plan_days table

  1. New Tables
    - `faculty_plan_days`
      - `id` (text, primary key)
      - `facultyId` (text)
      - `date` (date)
      - `description` (text)
      - `details` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `faculty_plan_days` table
    - Add policy for authenticated users to manage faculty plans
*/

CREATE TABLE IF NOT EXISTS faculty_plan_days (
  id text PRIMARY KEY,
  facultyId text NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faculty_plan_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON faculty_plan_days
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);