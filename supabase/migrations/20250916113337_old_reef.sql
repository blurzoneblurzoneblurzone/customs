/*
  # Полная перестройка базы данных для системы расписания РТА

  1. Очистка существующих таблиц
    - Удаление всех существующих таблиц и их данных
    - Очистка RLS политик

  2. Создание новых таблиц
    - `time_slots` - временные слоты (пары)
    - `subjects` - учебные дисциплины
    - `teachers` - преподаватели
    - `schedules` - основное расписание
    - `replacements` - замены занятий
    - `faculty_plan_days` - дни по плану факультета

  3. Настройка безопасности
    - Включение RLS для всех таблиц
    - Создание политик доступа для аутентифицированных пользователей

  4. Заполнение базовых данных
    - Временные слоты (6 пар)
    - Примеры дисциплин и преподавателей
*/

-- Удаляем существующие таблицы если они есть
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS replacements CASCADE;
DROP TABLE IF EXISTS faculty_plan_days CASCADE;
DROP TABLE IF EXISTS time_slots CASCADE;

-- Создаем таблицу временных слотов
CREATE TABLE time_slots (
  id text PRIMARY KEY,
  number integer NOT NULL CHECK (number >= 1 AND number <= 8),
  start_time text NOT NULL,
  end_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Создаем таблицу учебных дисциплин
CREATE TABLE subjects (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text,
  type text NOT NULL CHECK (type IN ('lecture', 'practical')),
  created_at timestamptz DEFAULT now()
);

-- Создаем таблицу преподавателей
CREATE TABLE teachers (
  id text PRIMARY KEY,
  name text NOT NULL,
  title text,
  created_at timestamptz DEFAULT now()
);

-- Создаем таблицу основного расписания
CREATE TABLE schedules (
  id text PRIMARY KEY,
  group_id text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 5),
  week_type text NOT NULL CHECK (week_type IN ('odd', 'even')),
  time_slot_id text NOT NULL REFERENCES time_slots(id),
  subject_id text NOT NULL REFERENCES subjects(id),
  teacher_id text NOT NULL REFERENCES teachers(id),
  classroom text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Создаем таблицу замен занятий
CREATE TABLE replacements (
  id text PRIMARY KEY,
  group_id text NOT NULL,
  date date NOT NULL,
  time_slot_id text NOT NULL REFERENCES time_slots(id),
  original_schedule_id text REFERENCES schedules(id),
  subject_id text NOT NULL REFERENCES subjects(id),
  teacher_id text NOT NULL REFERENCES teachers(id),
  classroom text NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Создаем таблицу дней по плану факультета
CREATE TABLE faculty_plan_days (
  id text PRIMARY KEY,
  faculty_id text NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE replacements ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_plan_days ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа для аутентифицированных пользователей
CREATE POLICY "Allow all operations for authenticated users" ON time_slots
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON subjects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON teachers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON schedules
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON replacements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON faculty_plan_days
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Политики для публичного чтения (для неаутентифицированных пользователей)
CREATE POLICY "Allow public read access" ON time_slots
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access" ON subjects
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access" ON teachers
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access" ON schedules
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access" ON replacements
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public read access" ON faculty_plan_days
  FOR SELECT TO anon USING (true);

-- Заполняем базовые временные слоты
INSERT INTO time_slots (id, number, start_time, end_time) VALUES
  ('slot-1', 1, '08:30', '10:00'),
  ('slot-2', 2, '10:10', '11:40'),
  ('slot-3', 3, '12:10', '13:40'),
  ('slot-4', 4, '13:50', '15:20'),
  ('slot-5', 5, '15:30', '17:00'),
  ('slot-6', 6, '17:10', '18:40');

-- Добавляем примеры дисциплин
INSERT INTO subjects (id, name, short_name, type) VALUES
  ('subj-1', 'Таможенное право', 'Там. право', 'lecture'),
  ('subj-2', 'Таможенное право', 'Там. право', 'practical'),
  ('subj-3', 'Экономическая теория', 'Эк. теория', 'lecture'),
  ('subj-4', 'Экономическая теория', 'Эк. теория', 'practical'),
  ('subj-5', 'Иностранный язык', 'Ин. язык', 'practical'),
  ('subj-6', 'Математика', 'Математика', 'lecture'),
  ('subj-7', 'Математика', 'Математика', 'practical'),
  ('subj-8', 'История России', 'История', 'lecture'),
  ('subj-9', 'Физическая культура', 'Физ-ра', 'practical'),
  ('subj-10', 'Философия', 'Философия', 'lecture');

-- Добавляем примеры преподавателей
INSERT INTO teachers (id, name, title) VALUES
  ('teach-1', 'Иванов Иван Иванович', 'к.ю.н., доцент'),
  ('teach-2', 'Петрова Мария Сергеевна', 'д.э.н., профессор'),
  ('teach-3', 'Сидоров Алексей Петрович', 'к.э.н., доцент'),
  ('teach-4', 'Козлова Елена Владимировна', 'старший преподаватель'),
  ('teach-5', 'Морозов Дмитрий Александрович', 'к.ф.-м.н., доцент'),
  ('teach-6', 'Волкова Анна Николаевна', 'к.и.н., доцент'),
  ('teach-7', 'Соколов Владимир Михайлович', 'преподаватель'),
  ('teach-8', 'Лебедева Ольга Игоревна', 'к.филос.н., доцент');

-- Добавляем примеры расписания для группы ТД-101 (1-1-1-1)
INSERT INTO schedules (id, group_id, day_of_week, week_type, time_slot_id, subject_id, teacher_id, classroom) VALUES
  -- Понедельник, нечетная неделя
  ('sched-1', '1-1-1-1', 0, 'odd', 'slot-1', 'subj-1', 'teach-1', '201'),
  ('sched-2', '1-1-1-1', 0, 'odd', 'slot-2', 'subj-3', 'teach-2', '201'),
  ('sched-3', '1-1-1-1', 0, 'odd', 'slot-3', 'subj-5', 'teach-4', '305'),
  
  -- Вторник, нечетная неделя
  ('sched-4', '1-1-1-1', 1, 'odd', 'slot-1', 'subj-6', 'teach-5', '102'),
  ('sched-5', '1-1-1-1', 1, 'odd', 'slot-2', 'subj-8', 'teach-6', '102'),
  ('sched-6', '1-1-1-1', 1, 'odd', 'slot-4', 'subj-9', 'teach-7', 'Спорт.зал'),
  
  -- Среда, нечетная неделя
  ('sched-7', '1-1-1-1', 2, 'odd', 'slot-1', 'subj-2', 'teach-1', '201'),
  ('sched-8', '1-1-1-1', 2, 'odd', 'slot-2', 'subj-4', 'teach-3', '201'),
  ('sched-9', '1-1-1-1', 2, 'odd', 'slot-3', 'subj-7', 'teach-5', '102'),
  
  -- Понедельник, четная неделя
  ('sched-10', '1-1-1-1', 0, 'even', 'slot-1', 'subj-10', 'teach-8', '201'),
  ('sched-11', '1-1-1-1', 0, 'even', 'slot-2', 'subj-4', 'teach-3', '201'),
  ('sched-12', '1-1-1-1', 0, 'even', 'slot-3', 'subj-5', 'teach-4', '305');

-- Добавляем пример замены
INSERT INTO replacements (id, group_id, date, time_slot_id, subject_id, teacher_id, classroom, reason) VALUES
  ('repl-1', '1-1-1-1', '2024-09-16', 'slot-1', 'subj-1', 'teach-3', '301', 'Болезнь преподавателя');

-- Добавляем пример дня по плану факультета
INSERT INTO faculty_plan_days (id, faculty_id, date, description, details) VALUES
  ('plan-1', '1', '2024-09-20', 'День открытых дверей', 'Проводится в актовом зале с 10:00 до 16:00');

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_schedules_group_day_week ON schedules(group_id, day_of_week, week_type);
CREATE INDEX idx_replacements_group_date ON replacements(group_id, date);
CREATE INDEX idx_faculty_plan_days_faculty_date ON faculty_plan_days(faculty_id, date);