/**
 * TripCalendar Component
 * 
 * Displays a calendar view of trips with highlighted dates
 * - Shows only months that have trips
 * - Highlights dates corresponding to trip dates
 * - Color-coded by trip location for future trips
 * - Gray color for past trips
 * - Liquid Glass style
 */

import { useMemo } from 'react';

interface Trip {
  id: number;
  title: string;
  date: string;
  participants: number;
  participantsList: any[];
}

interface TripCalendarProps {
  trips: Trip[];
  isTripsDatePassed?: (dateStr: string) => boolean;
  onDayClick?: (trip: Trip) => void;
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const monthMap: { [key: string]: number } = {
  'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6,
  'июля': 7, 'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
};

// Parse date string and extract start and end dates
// Handles formats like "20-29 марта", "7/11 сентября", "28 июня /3 июля"
function parseTripDates(dateStr: string): { startDay: number; endDay: number; month: number }[] | null {
  if (!dateStr) return null;

  const result: { startDay: number; endDay: number; month: number }[] = [];
  const dateStr_lower = dateStr.toLowerCase();
  
  // Handle cross-month dates like "28 июня /3 июля" or "28 июня/3 июля"
  // Split by "/" to check for cross-month dates
  if (dateStr_lower.includes('/') && dateStr_lower.includes('июня') && dateStr_lower.includes('июля')) {
    // Format: "28 июня /3 июля"
    const parts = dateStr_lower.split('/');
    if (parts.length === 2) {
      // First part: "28 июня "
      const firstMatch = parts[0].match(/(\d+)\s+(\w+)/);
      if (firstMatch) {
        const day1 = parseInt(firstMatch[1], 10);
        const month1 = monthMap[firstMatch[2]];
        if (month1) {
          result.push({ startDay: day1, endDay: 30, month: month1 });
        }
      }
      
      // Second part: "3 июля"
      const secondMatch = parts[1].match(/(\d+)\s+(\w+)/);
      if (secondMatch) {
        const day2 = parseInt(secondMatch[1], 10);
        const month2 = monthMap[secondMatch[2]];
        if (month2) {
          result.push({ startDay: 1, endDay: day2, month: month2 });
        }
      }
      
      return result.length > 0 ? result : null;
    }
  }
  
  // Handle standard formats: "20-29 марта" or "7/11 сентября"
  const parts = dateStr_lower.split(' ');
  if (parts.length < 2) return null;

  const datePart = parts[0];
  const monthPart = parts[1];

  const month = monthMap[monthPart];
  if (!month) return null;

  // Parse date range (could be "20-29" or "7/11")
  let startDay = 0;
  let endDay = 0;

  if (datePart.includes('-')) {
    const [start, end] = datePart.split('-');
    startDay = parseInt(start, 10);
    endDay = parseInt(end, 10);
  } else if (datePart.includes('/')) {
    const [start, end] = datePart.split('/');
    startDay = parseInt(start, 10);
    endDay = parseInt(end, 10);
  }

  if (startDay > 0 && endDay > 0) {
    result.push({ startDay, endDay, month });
    return result;
  }

  return null;
}

// Get color based on if trip has passed
function getColorForTrip(isPassed: boolean): string {
  // If trip has passed, use gray
  if (isPassed) {
    return 'bg-gray-400';
  }

  // All future trips use blue color
  return 'bg-blue-400';
}

// Get days in month
function getDaysInMonth(month: number, year: number = 2026): number {
  return new Date(year, month, 0).getDate();
}

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
function getFirstDayOfMonth(month: number, year: number = 2026): number {
  return new Date(year, month - 1, 1).getDay();
}

export function TripCalendar({ trips, isTripsDatePassed, onDayClick }: TripCalendarProps) {
  const monthsWithTrips = useMemo(() => {
    const months: { [key: number]: Set<number> } = {};
    const tripsByMonth: { [key: number]: Trip[] } = {};
    const dayToTripsMap: { [key: string]: Trip[] } = {}; // Map day to trips on that day

    trips.forEach(trip => {
      const parsedArray = parseTripDates(trip.date);
      if (parsedArray && parsedArray.length > 0) {
        // Handle multiple date ranges (for cross-month trips)
        parsedArray.forEach(parsed => {
          if (!months[parsed.month]) {
            months[parsed.month] = new Set();
            tripsByMonth[parsed.month] = [];
          }

          // Add all days in the range
          for (let day = parsed.startDay; day <= parsed.endDay; day++) {
            months[parsed.month].add(day);
            const dayKey = `${parsed.month}-${day}`;
            if (!dayToTripsMap[dayKey]) {
              dayToTripsMap[dayKey] = [];
            }
            dayToTripsMap[dayKey].push(trip);
          }

          if (!tripsByMonth[parsed.month].includes(trip)) {
            tripsByMonth[parsed.month].push(trip);
          }
        });
      }
    });

    return { months, tripsByMonth, dayToTripsMap };
  }, [trips]);

  const sortedMonths = Object.keys(monthsWithTrips.months)
    .map(Number)
    .sort((a, b) => a - b);

  if (sortedMonths.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-8">
      <h2 className="font-poppins font-semibold text-2xl text-foreground mb-6">
        Календарь выездов
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMonths.map(month => {
          const daysInMonth = getDaysInMonth(month);
          const firstDay = getFirstDayOfMonth(month);
          const highlightedDays = monthsWithTrips.months[month];
          const monthTrips = monthsWithTrips.tripsByMonth[month];

          return (
            <div
              key={month}
              className="rounded-[16px] p-5
                         shadow-[0_8px_32px_rgba(0,0,0,0.1)]
                         border border-white/30
                         backdrop-blur-md
                         bg-gradient-to-br from-slate-300/15 via-slate-300/10 to-slate-400/5
                         hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                         transition-all duration-200 ease-out"
            >
              {/* Month header */}
              <h3 className="font-poppins font-semibold text-lg text-foreground mb-4">
                {monthNames[month - 1]} 2026
              </h3>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day names */}
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isHighlighted = highlightedDays.has(day);
                  
                  // Get the color for this specific day
                  let dayColor = 'bg-white/10';
                  if (isHighlighted) {
                    const dayKey = `${month}-${day}`;
                    const tripsOnDay = monthsWithTrips.dayToTripsMap[dayKey] || [];
                    
                    // Find the first trip on this day and get its color
                    if (tripsOnDay.length > 0) {
                      const trip = tripsOnDay[0];
                      const isPassed = isTripsDatePassed ? isTripsDatePassed(trip.date) : false;
                      dayColor = getColorForTrip(isPassed);
                    }
                  }

                  return (
                    <div
                      key={day}
                      onClick={() => {
                        if (isHighlighted && onDayClick) {
                          const dayKey = `${month}-${day}`;
                          const tripsOnDay = monthsWithTrips.dayToTripsMap[dayKey] || [];
                          if (tripsOnDay.length > 0) {
                            onDayClick(tripsOnDay[0]);
                          }
                        }
                      }}
                      className={`aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200
                        ${isHighlighted
                          ? `${dayColor} text-white shadow-md cursor-pointer hover:shadow-lg`
                          : 'bg-white/10 text-foreground/60 hover:bg-white/20'
                        }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Trip info */}
              {monthTrips.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-muted-foreground font-inter uppercase tracking-wider mb-2">
                    Выезды в этом месяце
                  </p>
                  <div className="space-y-1">
                    {monthTrips.map(trip => (
                      <p key={trip.id} className="text-xs text-foreground font-inter line-clamp-1">
                        {trip.title}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
