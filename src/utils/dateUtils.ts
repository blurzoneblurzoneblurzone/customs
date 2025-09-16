// Точные даты начала каждой учебной недели
const WEEK_START_DATES = [
  '2024-09-01', // 1-я неделя (нечётная): 01.09 – 06.09
  '2024-09-08', // 2-я неделя (чётная): 08.09 – 13.09
  '2024-09-15', // 3-я неделя (нечётная): 15.09 – 20.09
  '2024-09-22', // 4-я неделя (чётная): 22.09 – 27.09
  '2024-09-29', // 5-я неделя (нечётная): 29.09 – 04.10
  '2024-10-06', // 6-я неделя (чётная): 06.10 – 11.10
  '2024-10-13', // 7-я неделя (нечётная): 13.10 – 18.10
  '2024-10-20', // 8-я неделя (чётная): 20.10 – 25.10
  '2024-10-27', // 9-я неделя (нечётная): 27.10 – 01.11
  '2024-11-03', // 10-я неделя (чётная): 03.11 – 08.11
  '2024-11-10', // 11-я неделя (нечётная): 10.11 – 15.11
  '2024-11-17', // 12-я неделя (чётная): 17.11 – 22.11
  '2024-11-24', // 13-я неделя (нечётная): 24.11 – 29.11
  '2024-12-01', // 14-я неделя (чётная): 01.12 – 06.12
  '2024-12-08', // 15-я неделя (нечётная): 08.12 – 13.12
  '2024-12-15', // 16-я неделя (чётная): 15.12 – 20.12
  '2024-12-22', // 17-я неделя (нечётная): 22.12 – 27.12
];

export function getCurrentWeekInfo(): {
  weekNumber: number;
  weekType: 'even' | 'odd';
  currentDate: string;
} {
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