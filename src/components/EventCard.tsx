import React from 'react';
import { Event } from '../types/Event';

interface EventCardProps {
  event: Event;
  isConflict?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDragStart?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isConflict, 
  onClick, 
  onDragStart 
}) => {
  const getEventColor = () => {
    if (isConflict) return 'bg-red-100 border-red-300 text-red-800';
    
    switch (event.type) {
      case 'meeting':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'personal':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'work':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'reminder':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'schedule':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(event));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(event);
    }
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        px-2 py-1 rounded text-xs font-medium border-l-2 truncate cursor-grab active:cursor-grabbing
        hover:shadow-sm transition-all duration-200 hover:scale-105
        ${getEventColor()}
      `}
      title={`${event.title} - ${event.startTime} to ${event.endTime}`}
      onClick={onClick}
    >
      <div className="truncate font-semibold">{event.title}</div>
      <div className="text-xs opacity-75">{event.startTime} - {event.endTime}</div>
    </div>
  );
};
