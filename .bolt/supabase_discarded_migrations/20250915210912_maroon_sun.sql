/*
  # Create schedules table

  1. New Tables
    - `schedules`
      - `id` (text, primary key)
      - `groupId` (text)
      - `dayOfWeek` (integer, 0-5 for Monday-Saturday)
      - `weekType` (text, 'odd' or 'even')
      - `timeSlotId` (text)
      - `subjectId` (text)
      - `teacherId` (text)
      - `classroom` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `schedules` table
    - Add policy for authenticated users to manage schedules
*/

CREATE TABLE IF NOT EXISTS schedules (
  id text PRIMARY KEY,
  groupId text NOT NULL,
  dayOfWeek integer NOT NULL CHECK (dayOfWeek >= 0 AND dayOfWeek <= 5),
  weekType text NOT NULL CHECK (weekType IN ('odd', 'even')),
  timeSlotId text NOT NULL,
  subjectId text NOT NULL,
  teacherId text NOT NULL,
  classroom text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users"
  ON schedules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);