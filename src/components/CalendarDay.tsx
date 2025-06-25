import React, { useState } from 'react';
import { format } from 'date-fns';
import { Event } from '../types/Event';
import { EventCard } from './EventCard';

interface CalendarDayProps {
  date: Date;
  events: Event[];
  isToday: boolean;
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onEventDrop?: (event: Event, newDate: Date) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ 
  date, 
  events, 
  isToday, 
  onDayClick,
  onEventClick,
  onEventDrop
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dayNumber = format(date, 'd');
  
  // Sort events by start time
  const sortedEvents = events.sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Check for overlapping events
  const hasConflicts = events.length > 1 && events.some((event, index) => {
    if (index === 0) return false;
    const currentStart = event.startTime;
    const currentEnd = event.endTime;
    const prevEvent = sortedEvents[index - 1];
    const prevEnd = prevEvent.endTime;
    
    return currentStart < prevEnd;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const eventData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (onEventDrop && eventData) {
        onEventDrop(eventData, date);
      }
    } catch (error) {
      console.error('Error parsing dropped event data:', error);
    }
  };
  
  return (
    <div 
      className={`h-32 border-r border-b border-gray-100 relative overflow-hidden group transition-colors cursor-pointer ${
        isDragOver ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
      }`}
      onClick={() => onDayClick(date)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Day Number */}
      <div className="p-2">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full transition-colors ${
            isToday
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {dayNumber}
        </span>
        
        {/* Conflict Indicator */}
        {hasConflicts && (
          <div 
            className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" 
            title="Scheduling conflicts" 
          />
        )}
      </div>
      
      {/* Events */}
      <div className="px-1 space-y-1 overflow-hidden">
        {sortedEvents.slice(0, 3).map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            isConflict={hasConflicts && index > 0}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          />
        ))}
        
        {/* More events indicator */}
        {events.length > 3 && (
          <div className="text-xs text-gray-500 px-1 py-1 rounded bg-gray-100">
            +{events.length - 3} more events
          </div>
        )}
      </div>

      {/* Drop indicator */}
      {isDragOver && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 flex items-center justify-center">
          <span className="text-blue-600 text-xs font-medium">Drop here</span>
        </div>
      )}

      {/* Add Event Button - shows on hover */}
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-blue-700 transition-colors">
          +
        </div>
      </div>
    </div>
  );
};
