import { describe, it, expect } from 'vitest';

// Month mapping for date parsing
const monthMap: { [key: string]: number } = {
  'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6,
  'июля': 7, 'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
};

// Parse date string and return comparable number for sorting
function parseDateForSort(dateStr: string): number {
  if (!dateStr) return 0;
  
  // Try to parse dates like "20-29 марта" or "7/11 сентября"
  const parts = dateStr.toLowerCase().split(' ');
  if (parts.length < 2) return 0;
  
  const monthName = parts[parts.length - 1];
  const month = monthMap[monthName] || 0;
  
  // Extract first day number from date range
  const dayPart = parts[0];
  const dayMatch = dayPart.match(/\d+/);
  const day = dayMatch ? parseInt(dayMatch[0]) : 0;
  
  // Return comparable number: month * 100 + day
  return month * 100 + day;
}

describe('Date Sorting Function', () => {
  it('should parse date string correctly', () => {
    expect(parseDateForSort('20-29 марта')).toBe(320); // March 20
    expect(parseDateForSort('3-12 апреля')).toBe(403); // April 3
    expect(parseDateForSort('25/29 мая')).toBe(525); // May 25
  });

  it('should handle different date formats', () => {
    expect(parseDateForSort('7/11 сентября')).toBe(907); // September 7
    expect(parseDateForSort('2-11 октября')).toBe(1002); // October 2
    expect(parseDateForSort('24/28 августа')).toBe(824); // August 24
  });

  it('should return 0 for empty or invalid dates', () => {
    expect(parseDateForSort('')).toBe(0);
    expect(parseDateForSort('invalid')).toBe(0);
    expect(parseDateForSort('no date here')).toBe(0);
  });

  it('should sort trips correctly by date', () => {
    const trips = [
      { id: 1, title: 'Trip 1', date: '20-29 марта', participants: 5, participantsList: [] },
      { id: 2, title: 'Trip 2', date: '3-12 апреля', participants: 6, participantsList: [] },
      { id: 3, title: 'Trip 3', date: '25/29 мая', participants: 12, participantsList: [] },
      { id: 4, title: 'Trip 4', date: '7/11 сентября', participants: 8, participantsList: [] },
    ];

    const sortedTrips = [...trips].sort((a, b) => {
      return parseDateForSort(a.date) - parseDateForSort(b.date);
    });

    // Should be sorted: April -> March -> May -> September
    expect(sortedTrips[0].date).toBe('3-12 апреля');
    expect(sortedTrips[1].date).toBe('20-29 марта');
    expect(sortedTrips[2].date).toBe('25/29 мая');
    expect(sortedTrips[3].date).toBe('7/11 сентября');
  });

  it('should handle all months correctly', () => {
    const months = [
      { date: '1 января', expected: 101 },
      { date: '1 февраля', expected: 201 },
      { date: '1 марта', expected: 301 },
      { date: '1 апреля', expected: 401 },
      { date: '1 мая', expected: 501 },
      { date: '1 июня', expected: 601 },
      { date: '1 июля', expected: 701 },
      { date: '1 августа', expected: 801 },
      { date: '1 сентября', expected: 901 },
      { date: '1 октября', expected: 1001 },
      { date: '1 ноября', expected: 1101 },
      { date: '1 декабря', expected: 1201 },
    ];

    months.forEach(({ date, expected }) => {
      expect(parseDateForSort(date)).toBe(expected);
    });
  });
});
