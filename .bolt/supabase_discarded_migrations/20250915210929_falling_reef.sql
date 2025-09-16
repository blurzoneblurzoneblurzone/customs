/*
  # Insert sample data

  1. Sample Data
    - Add sample subjects
    - Add sample teachers
    - Add sample schedules for testing

  This migration adds initial data for development and testing purposes.
*/

-- Insert sample subjects
INSERT INTO subjects (id, name, shortName, type) VALUES
  ('subj-1', 'Таможенное право', 'ТП', 'lecture'),
  ('subj-2', 'Экономическая теория', 'ЭТ', 'lecture'),
  ('subj-3', 'Гражданское право', 'ГП', 'practical'),
  ('subj-4', 'Международное право', 'МП', 'lecture'),
  ('subj-5', 'Финансовое право', 'ФП', 'practical')
ON CONFLICT (id) DO NOTHING;

-- Insert sample teachers
INSERT INTO teachers (id, name, title) VALUES
  ('teach-1', 'Иванов Иван Иванович', 'к.ю.н., доцент'),
  ('teach-2', 'Петрова Мария Сергеевна', 'д.э.н., профессор'),
  ('teach-3', 'Сидоров Алексей Владимирович', 'к.ю.н., старший преподаватель'),
  ('teach-4', 'Козлова Елена Николаевна', 'к.э.н., доцент'),
  ('teach-5', 'Морозов Дмитрий Александрович', 'д.ю.н., профессор')
ON CONFLICT (id) DO NOTHING;

-- Insert sample schedule entries
INSERT INTO schedules (id, groupId, dayOfWeek, weekType, timeSlotId, subjectId, teacherId, classroom) VALUES
  ('sched-1', 'td-101', 0, 'odd', '1', 'subj-1', 'teach-1', 'А-101'),
  ('sched-2', 'td-101', 0, 'odd', '2', 'subj-2', 'teach-2', 'А-102'),
  ('sched-3', 'td-101', 1, 'odd', '1', 'subj-3', 'teach-3', 'А-103'),
  ('sched-4', 'td-101', 1, 'even', '1', 'subj-4', 'teach-4', 'А-104'),
  ('sched-5', 'td-101', 2, 'odd', '2', 'subj-5', 'teach-5', 'А-105')
ON CONFLICT (id) DO NOTHING;