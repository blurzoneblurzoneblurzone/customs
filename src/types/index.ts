export interface Faculty {
  id: string;
  name: string;
  shortName: string;
}

export interface Course {
  id: string;
  facultyId: string;
  number: number; // 1-5
  streamsCount: number;
  groupsPerStream: number;
}

export interface Stream {
  id: string;
  courseId: string;
  number: number;
  name: string;
}

export interface Group {
  id: string;
  streamId: string;
  number: number;
  name: string; // например "ТД-101"
}

export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  number: number; // номер пары
}

export interface Teacher {
  id: string;
  name: string;
  title?: string; // должность/звание
}

export interface Subject {
  id: string;
  name: string;
  shortName?: string;
  type: 'lecture' | 'practical';
}

export interface Schedule {
  id: string;
  groupId: string;
  dayOfWeek: number; // 0-5 (понедельник-суббота)
  timeSlotId: string;
  subjectId: string;
  teacherId: string;
  classroom: string;
  weekType: 'even' | 'odd'; // четная или нечетная неделя
}

export interface Exception {
  id: string;
  scheduleId: string;
  date: string; // конкретная дата исключения
  reason?: string;
}

export interface Replacement {
  id: string;
  groupId: string;
  date: string;
  timeSlotId: string;
  originalScheduleId?: string;
  subjectId: string;
  teacherId: string;
  classroom: string;
  reason?: string;
}

export interface FacultyPlanDay {
  id: string;
  facultyId: string;
  date: string;
  description: string;
  details?: string;
}

export interface WeekInfo {
  weekNumber: number;
  weekType: 'even' | 'odd';
  startDate: string;
  endDate: string;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5;

export const DAYS_OF_WEEK: string[] = [
  'Понедельник',
  'Вторник', 
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота'
];

export const FACULTIES: Faculty[] = [
  { id: '1', name: 'Факультет таможенного дела', shortName: 'ФТД' },
  { id: '2', name: 'Экономический факультет', shortName: 'ЭФ' },
  { id: '3', name: 'Юридический факультет', shortName: 'ЮФ' }
];

export const COURSES: Course[] = [
  { id: '1', facultyId: '1', number: 1, streamsCount: 2, groupsPerStream: 3 },
  { id: '2', facultyId: '1', number: 2, streamsCount: 2, groupsPerStream: 3 },
  { id: '3', facultyId: '1', number: 3, streamsCount: 2, groupsPerStream: 3 },
  { id: '4', facultyId: '1', number: 4, streamsCount: 2, groupsPerStream: 3 },
  { id: '5', facultyId: '1', number: 5, streamsCount: 1, groupsPerStream: 2 },
  
  { id: '6', facultyId: '2', number: 1, streamsCount: 3, groupsPerStream: 4 },
  { id: '7', facultyId: '2', number: 2, streamsCount: 3, groupsPerStream: 4 },
  { id: '8', facultyId: '2', number: 3, streamsCount: 2, groupsPerStream: 3 },
  { id: '9', facultyId: '2', number: 4, streamsCount: 2, groupsPerStream: 3 },
  
  { id: '10', facultyId: '3', number: 1, streamsCount: 2, groupsPerStream: 3 },
  { id: '11', facultyId: '3', number: 2, streamsCount: 2, groupsPerStream: 3 },
  { id: '12', facultyId: '3', number: 3, streamsCount: 2, groupsPerStream: 3 },
  { id: '13', facultyId: '3', number: 4, streamsCount: 1, groupsPerStream: 2 },
];

export const STREAMS: Stream[] = [
  // ФТД 1 курс
  { id: '1', courseId: '1', number: 1, name: 'ТД-1' },
  { id: '2', courseId: '1', number: 2, name: 'ТД-2' },
  
  // ФТД 2 курс
  { id: '3', courseId: '2', number: 1, name: 'ТД-1' },
  { id: '4', courseId: '2', number: 2, name: 'ТД-2' },
  
  // ФТД 3 курс
  { id: '5', courseId: '3', number: 1, name: 'ТД-1' },
  { id: '6', courseId: '3', number: 2, name: 'ТД-2' },
  
  // ФТД 4 курс
  { id: '7', courseId: '4', number: 1, name: 'ТД-1' },
  { id: '8', courseId: '4', number: 2, name: 'ТД-2' },
  
  // ФТД 5 курс
  { id: '9', courseId: '5', number: 1, name: 'ТД-1' },
  
  // ЭФ 1 курс
  { id: '10', courseId: '6', number: 1, name: 'ЭК-1' },
  { id: '11', courseId: '6', number: 2, name: 'ЭК-2' },
  { id: '12', courseId: '6', number: 3, name: 'ЭК-3' },
  
  // ЭФ 2 курс
  { id: '13', courseId: '7', number: 1, name: 'ЭК-1' },
  { id: '14', courseId: '7', number: 2, name: 'ЭК-2' },
  { id: '15', courseId: '7', number: 3, name: 'ЭК-3' },
  
  // ЭФ 3 курс
  { id: '16', courseId: '8', number: 1, name: 'ЭК-1' },
  { id: '17', courseId: '8', number: 2, name: 'ЭК-2' },
  
  // ЭФ 4 курс
  { id: '18', courseId: '9', number: 1, name: 'ЭК-1' },
  { id: '19', courseId: '9', number: 2, name: 'ЭК-2' },
  
  // ЮФ 1 курс
  { id: '20', courseId: '10', number: 1, name: 'ЮР-1' },
  { id: '21', courseId: '10', number: 2, name: 'ЮР-2' },
  
  // ЮФ 2 курс
  { id: '22', courseId: '11', number: 1, name: 'ЮР-1' },
  { id: '23', courseId: '11', number: 2, name: 'ЮР-2' },
  
  // ЮФ 3 курс
  { id: '24', courseId: '12', number: 1, name: 'ЮР-1' },
  { id: '25', courseId: '12', number: 2, name: 'ЮР-2' },
  
  // ЮФ 4 курс
  { id: '26', courseId: '13', number: 1, name: 'ЮР-1' },
];

export const GROUPS: Group[] = [
  // ФТД 1 курс, поток 1
  { id: '1', streamId: '1', number: 1, name: 'ТД-101' },
  { id: '2', streamId: '1', number: 2, name: 'ТД-102' },
  { id: '3', streamId: '1', number: 3, name: 'ТД-103' },
  
  // ФТД 1 курс, поток 2
  { id: '4', streamId: '2', number: 1, name: 'ТД-104' },
  { id: '5', streamId: '2', number: 2, name: 'ТД-105' },
  { id: '6', streamId: '2', number: 3, name: 'ТД-106' },
  
  // ФТД 2 курс, поток 1
  { id: '7', streamId: '3', number: 1, name: 'ТД-201' },
  { id: '8', streamId: '3', number: 2, name: 'ТД-202' },
  { id: '9', streamId: '3', number: 3, name: 'ТД-203' },
  
  // ФТД 2 курс, поток 2
  { id: '10', streamId: '4', number: 1, name: 'ТД-204' },
  { id: '11', streamId: '4', number: 2, name: 'ТД-205' },
  { id: '12', streamId: '4', number: 3, name: 'ТД-206' },
  
  // ЭФ 1 курс, поток 1
  { id: '13', streamId: '10', number: 1, name: 'ЭК-101' },
  { id: '14', streamId: '10', number: 2, name: 'ЭК-102' },
  { id: '15', streamId: '10', number: 3, name: 'ЭК-103' },
  { id: '16', streamId: '10', number: 4, name: 'ЭК-104' },
  
  // ЭФ 1 курс, поток 2
  { id: '17', streamId: '11', number: 1, name: 'ЭК-105' },
  { id: '18', streamId: '11', number: 2, name: 'ЭК-106' },
  { id: '19', streamId: '11', number: 3, name: 'ЭК-107' },
  { id: '20', streamId: '11', number: 4, name: 'ЭК-108' },
  
  // ЮФ 1 курс, поток 1
  { id: '21', streamId: '20', number: 1, name: 'ЮР-101' },
  { id: '22', streamId: '20', number: 2, name: 'ЮР-102' },
  { id: '23', streamId: '20', number: 3, name: 'ЮР-103' },
  
  // ЮФ 1 курс, поток 2
  { id: '24', streamId: '21', number: 1, name: 'ЮР-104' },
  { id: '25', streamId: '21', number: 2, name: 'ЮР-105' },
  { id: '26', streamId: '21', number: 3, name: 'ЮР-106' },
];

export const DEFAULT_TIME_SLOTS: Omit<TimeSlot, 'id'>[] = [
  { number: 1, startTime: '08:30', endTime: '10:00' },
  { number: 2, startTime: '10:10', endTime: '11:40' },
  { number: 3, startTime: '12:10', endTime: '13:40' },
  { number: 4, startTime: '13:50', endTime: '15:20' },
  { number: 5, startTime: '15:30', endTime: '17:00' },
  { number: 6, startTime: '17:10', endTime: '18:40' }
];