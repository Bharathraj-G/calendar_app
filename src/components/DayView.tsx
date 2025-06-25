import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Event } from '../types/Event';
import { EventCard } from './EventCard';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

export const DayView: React.FC<DayViewProps> = ({ 
  currentDate, 
  events, 
  onEventClick,
  onTimeSlotClick 
}) => {
  // Generate hours from 0 to 23
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Filter events for the current day
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.date), currentDate)
  );

  // Get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hour;
    });
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="bg-white">
      {/* Day Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>

      {/* Time Slots */}
      <div className="max-h-96 overflow-y-auto">
        {hours.map(hour => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div 
              key={hour} 
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => onTimeSlotClick(currentDate, hour)}
            >
              <div className="flex">
                {/* Time Label */}
                <div className="w-20 p-3 text-sm font-medium text-gray-500 border-r border-gray-100 flex-shrink-0">
                  {formatHour(hour)}
                </div>
                
                {/* Events Container */}
                <div className="flex-1 p-2 min-h-[60px]">
                  <div className="space-y-1">
                    {hourEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};