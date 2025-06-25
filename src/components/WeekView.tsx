import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { Event } from '../types/Event';
import { EventCard } from './EventCard';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onDayClick: (date: Date) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ 
  currentDate, 
  events, 
  onEventClick,
  onDayClick 
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="bg-white">
      {/* Week Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h2>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map(day => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toISOString()} 
              className="bg-white min-h-[200px] cursor-pointer hover:bg-gray-50"
              onClick={() => onDayClick(day)}
            >
              {/* Day Header */}
              <div className="p-3 border-b border-gray-100">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    {format(day, 'EEE')}
                  </div>
                  <div 
                    className={`mt-1 text-sm font-semibold ${
                      isToday 
                        ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto' 
                        : 'text-gray-900'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                </div>
              </div>

              {/* Events */}
              <div className="p-2 space-y-1">
                {dayEvents.slice(0, 4).map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  />
                ))}
                
                {dayEvents.length > 4 && (
                  <div className="text-xs text-gray-500 px-1 py-1 rounded bg-gray-100">
                    +{dayEvents.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
