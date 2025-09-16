import { WEEK_CONFIG, WEEK_START_DATES } from '../config/weekConfig';

export function getCurrentWeekInfo(): {
  weekNumber: number;
  weekType: 'even' | 'odd';
  currentDate: string;
} {
  // Если используется фиксированный номер недели
  if (!WEEK_CONFIG.useAutoDetection) {
    const weekNumber = WEEK_CONFIG.currentWeekNumber;
    const weekType: 'even' | 'odd' = weekNumber % 2 === 0 ? 'even' : 'odd';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return {
      weekNumber,
      weekType,
      currentDate
    };
  }
  
  // Автоматическое определение по дате
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];
  
  // Находим текущую неделю по дате
  for (let i = 0; i < WEEK_START_DATES.length; i++) {
    const weekStart = new Date(WEEK_START_DATES[i]);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 5); // пн-сб (6 дней)
    
    if (currentDate >= weekStart && currentDate <= weekEnd) {
      const weekNumber = i + 1;
      const weekType: 'even' | 'odd' = weekNumber % 2 === 0 ? 'even' : 'odd';
      
      return {
        weekNumber,
        weekType,
        currentDate: currentDateString
      };
    }
  }
  
  // Если дата не попадает ни в одну неделю, возвращаем первую неделю
  const weekNumber = 1;
  const weekType: 'even' | 'odd' = 'odd';
  
  return {
    weekNumber,
    weekType,
    currentDate: currentDateString
  };
}

export function getWeekNumber(): number {
  return getCurrentWeekInfo().weekNumber;
}

export function getCurrentWeekType(): 'even' | 'odd' {
  return getCurrentWeekInfo().weekType;
}

export function getWeekDates(weekNumber: number): {
  startDate: string;
  endDate: string;
} {
  // Проверяем, что номер недели в допустимых пределах
  const weekIndex = Math.max(0, Math.min(weekNumber - 1, WEEK_START_DATES.length - 1));
  
  const startDate = new Date(WEEK_START_DATES[weekIndex]);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 5); // Добавляем 5 дней (пн-сб)
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatWeekDates(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return `${start.getDate().toString().padStart(2, '0')}.${(start.getMonth() + 1).toString().padStart(2, '0')} - ${end.getDate().toString().padStart(2, '0')}.${(end.getMonth() + 1).toString().padStart(2, '0')}`;
}

export function isCurrentWeek(weekStartDate: string): boolean {
  const today = new Date();
  const weekStart = new Date(weekStartDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 5); // пн-сб
  
  return today >= weekStart && today <= weekEnd;
}

export function getTodayDayOfWeek(): number {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return dayOfWeek === 0 ? 7 : dayOfWeek; // Воскресенье = 7
}

export function getMaxWeekNumber(): number {
  return WEEK_START_DATES.length;
}