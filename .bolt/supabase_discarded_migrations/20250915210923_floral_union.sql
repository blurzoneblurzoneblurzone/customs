/*
  # Create replacements table

  1. New Tables
    - `replacements`
      - `id` (text, primary key)
      - `groupId` (text)
      - `date` (date)
      - `timeSlotId` (text)
      - `originalScheduleId` (text, nullable)
      - `subjectId` (text)
      - `teacherId` (text)
      - `classroom` (text)
      - `reason` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `replacements` table
    - Add policy for authenticated users to manage replacements
*/

CREATE TABLE IF NOT EXISTS replacements (
  id text PRIMARY KEY,
  groupId text NOT NULL,
  date date NOT NULL,
  timeSlotId text NOT NULL,
  originalScheduleId text,
  subjectId text NOT NULL,
  teacherId text NOT NULL,
  classroom text NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE replacements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON replacements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);