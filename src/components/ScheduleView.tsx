import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  Book, 
  AlertTriangle,
  Filter
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { getCurrentWeekInfo, getWeekDates, formatWeekDates } from '../utils/dateUtils';
import { FACULTIES, COURSES, STREAMS, GROUPS, DEFAULT_TIME_SLOTS, DAYS_OF_WEEK } from '../types';

export default function ScheduleView() {
  const { 
    schedules, 
    replacements, 
    facultyPlanDays, 
    subjects, 
    teachers, 
    loading
  } = useData();

  const [currentWeek, setCurrentWeek] = useState(() => getCurrentWeekInfo());
  const [selectedFaculty, setSelectedFaculty] = useState<string>('1');
  const [selectedCourse, setSelectedCourse] = useState<number>(1);
  const [selectedStream, setSelectedStream] = useState<string>('1');
  const [selectedGroup, setSelectedGroup] = useState<string>('1');

  const weekDates = getWeekDates(currentWeek.weekNumber);

  const faculty = FACULTIES.find(f => f.id === selectedFaculty);
  const availableCourses = COURSES.filter(c => c.facultyId === selectedFaculty);
  const selectedCourseData = availableCourses.find(c => c.number === selectedCourse);
  
  // Получаем настройки курса
  const courseSettings = JSON.parse(localStorage.getItem('courseSettings') || '[]');
  const currentCourseSettings = courseSettings.find((c: any) => 
    c.facultyId === selectedFaculty && c.number === selectedCourse
  ) || selectedCourseData;
  
  const maxStreams = currentCourseSettings?.streamsCount || 1;
  const maxGroups = currentCourseSettings?.groupsPerStream || 5;
  
  // Генерируем потоки и группы по цифрам
  const availableStreams = Array.from({ length: maxStreams }, (_, i) => i + 1);
  const availableGroups = Array.from({ length: maxGroups }, (_, i) => i + 1);
  
  // Формируем ID группы
  const groupId = `${selectedFaculty}-${selectedCourse}-${selectedStream}-${selectedGroup}`;

  // Обновляем зависимые селекторы при изменении родительских
  React.useEffect(() => {
    const firstCourse = availableCourses[0];
    if (firstCourse && !availableCourses.find(c => c.number === selectedCourse)) {
      setSelectedCourse(firstCourse.number);
    }
  }, [selectedFaculty, availableCourses, selectedCourse]);

  React.useEffect(() => {
    if (selectedStream > maxStreams) {
      setSelectedStream('1');
    }
  }, [selectedCourse, maxStreams, selectedStream]);

  React.useEffect(() => {
    if (selectedGroup > maxGroups) {
      setSelectedGroup('1');
    }
  }, [selectedStream, maxGroups, selectedGroup]);

  const navigateWeek = (direction: 'prev' | 'next' | 'current') => {
    if (direction === 'current') {
      setCurrentWeek(getCurrentWeekInfo());
    } else {
      const newWeekNumber = direction === 'prev' 
        ? Math.max(1, currentWeek.weekNumber - 1)
        : currentWeek.weekNumber + 1;
      
      setCurrentWeek({
        weekNumber: newWeekNumber,
        weekType: newWeekNumber % 2 === 0 ? 'even' : 'odd',
        currentDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const getScheduleForSlot = (dayIndex: number, timeSlotId: string) => {
    const date = getDateForDay(dayIndex);

    // 2. ПРИОРИТЕТ: Замены
    const replacement = replacements.find(r => 
      r.groupid === groupId && 
      r.date === date && 
      r.timeslotid === timeSlotId
    );
    
    if (replacement) {
      return { type: 'replacement', data: replacement };
    }

    // 3. ПРИОРИТЕТ: Обычное расписание
    const schedule = schedules.find(s => 
      s.groupid === groupId && 
      s.dayofweek === dayIndex && 
      s.weektype === currentWeek.weekType && 
      s.timeslotid === timeSlotId
    );

    if (schedule) {
      return { type: 'schedule', data: schedule };
    }

    // 4. Пустота, если ничего не найдено
    return null;
  };

  const getFacultyPlanForDay = (dayIndex: number) => {
    const date = getDateForDay(dayIndex);
    
    return facultyPlanDays.find(plan => {
      return plan.facultyid === selectedFaculty && plan.date === date;
    });
  };

  const hasFacultyPlanForDay = (dayIndex: number) => !!getFacultyPlanForDay(dayIndex);

  const getDateForDay = (dayIndex: number): string => {
    const startDate = new Date(weekDates.startDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayIndex);
    return targetDate.toISOString().split('T')[0];
  };

  const renderScheduleCell = (dayIndex: number, timeSlot: any) => {
    const scheduleInfo = getScheduleForSlot(dayIndex, timeSlot.id || `slot-${timeSlot.number}`);
    
    if (!scheduleInfo) {
      return (
        <div className="h-20 p-2 border-b border-gray-100 bg-gray-50/30">
          <div className="h-full flex items-center justify-center text-gray-400">
            <span className="text-xs">—</span>
          </div>
        </div>
      );
    }

    const isReplacement = scheduleInfo.type === 'replacement';
    const data = scheduleInfo.data;
    const subject = subjects.find(s => s.id === data.subjectid);
    const teacher = teachers.find(t => t.id === data.teacherid);

    return (
      <div className={`h-20 p-2 border-l-4 border-b border-gray-100 ${
        isReplacement 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 shadow-sm' 
          : 'bg-white border-slate-300'
      }`}>
        {isReplacement && (
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle className="h-3 w-3 text-blue-600 mr-1" />
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">ЗАМЕНА</span>
          </div>
        )}
        
        {isReplacement && data.reason && (
          <div className="text-xs text-blue-600 text-center mb-1 italic">
            {data.reason}
          </div>
        )}
        
        <div className="space-y-1">
          <div className="flex items-start space-x-1">
            <Book className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-medium text-gray-900 leading-tight">
              {subject?.name || data.subjectid}
            </div>
          </div>
          
          <div className="flex items-start space-x-1">
            <User className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-700 leading-tight">
              {teacher?.name || data.teacherid}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">{data.classroom}</span>
            </div>
            <span className={`text-xs px-1 py-0.5 rounded text-white ${
              subject?.type === 'lecture' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {subject?.type === 'lecture' ? 'Лек' : 'П/з'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Загрузка данных...</div>
          </div>
        )}

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Фильтры</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Факультет
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FACULTIES.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Курс
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableCourses.map(course => (
                  <option key={course.id} value={course.number}>
                    {course.number} курс
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поток
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableStreams.map(streamNum => (
                  <option key={streamNum} value={streamNum}>
                    {streamNum}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Группа
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableGroups.map(groupNum => (
                <option key={groupNum} value={groupNum}>
                  {groupNum}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Навигация по неделям */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek('prev')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Предыдущая
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {currentWeek.weekNumber} неделя ({currentWeek.weekType === 'even' ? 'четная' : 'нечетная'})
              </div>
              <div className="text-sm text-gray-600">
                {formatWeekDates(weekDates.startDate, weekDates.endDate)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('current')}
                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Текущая
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Следующая
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Таблица расписания */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Расписание занятий
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {faculty?.name} • {selectedCourse} курс • Поток {selectedStream} • Группа {selectedGroup}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    <Clock className="h-4 w-4 mx-auto" />
                  </th>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEFAULT_TIME_SLOTS.map((timeSlot, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-center border-r border-gray-200 bg-gray-50">
                      <div className="text-sm font-medium text-gray-900">
                        {timeSlot.number}
                      </div>
                      <div className="text-xs text-gray-600">
                        {timeSlot.startTime}
                      </div>
                      <div className="text-xs text-gray-600">
                        {timeSlot.endTime}
                      </div>
                    </td>
                    {DAYS_OF_WEEK.map((_, dayIndex) => (
                      <td key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative">
                        {hasFacultyPlanForDay(dayIndex) ? (
                          index === 0 ? (
                            <div className="absolute inset-0 z-10" style={{ height: `${DEFAULT_TIME_SLOTS.length * 80}px` }}>
                              <div className="h-full p-2 border-l-4 border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm flex flex-col justify-center">
                                <div className="flex items-center justify-center mb-2">
                                  <Calendar className="h-4 w-4 text-amber-600 mr-2" />
                                  <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">ДЕНЬ ПО ПЛАНУ</span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-start space-x-1">
                                    <Book className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm font-medium text-amber-900 leading-tight text-center">
                                      {getFacultyPlanForDay(dayIndex)?.description}
                                    </div>
                                  </div>
                                  
                                  {getFacultyPlanForDay(dayIndex)?.details && (
                                    <div className="flex items-start space-x-1">
                                      <User className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                                      <div className="text-xs text-amber-800 leading-tight text-center">
                                        {getFacultyPlanForDay(dayIndex)?.details}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-center mt-3">
                                    <span className="text-xs px-2 py-1 rounded text-white bg-amber-600">
                                      Занятия отменены
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-20"></div>
                          )
                        ) : (
                          renderScheduleCell(dayIndex, timeSlot)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}