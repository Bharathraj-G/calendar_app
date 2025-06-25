import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarDay } from './CalendarDay';
import { EventDialog } from './EventDialog';
import { ViewSwitcher, ViewType } from './ViewSwitcher';
import { DateYearPicker } from './DateYearPicker';
import { Event, NewEvent } from '../types/Event';
import { DayView } from './DayView';
import { WeekView } from './WeekView';

interface CalendarProps {
  events: Event[];
  onAddEvent: (event: NewEvent) => void;
  onUpdateEvent: (eventId: string, event: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  events, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the first day of the week for the month (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);
  
  // Create padding days for the beginning of the month
  const paddingDays = Array.from({ length: startDay }, (_, i) => null);
  
  const navigateToPrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  const navigateToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setIsDialogOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedDate(new Date());
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setSelectedDate(selectedDateTime);
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEventDrop = (draggedEvent: Event, newDate: Date) => {
    const newDateString = format(newDate, 'yyyy-MM-dd');
    
    // Only update if the date actually changed
    if (draggedEvent.date !== newDateString) {
      onUpdateEvent(draggedEvent.id, { date: newDateString });
    }
  };

  const renderCalendarContent = () => {
    switch (currentView) {
      case 'day':
        return (
          <DayView 
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'week':
        return (
          <WeekView 
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
          />
        );
      case 'month':
      default:
        return (
          <>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div
                  key={day}
                  className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-100 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {/* Padding days */}
              {paddingDays.map((_, index) => (
                <div key={`padding-${index}`} className="h-32 border-r border-b border-gray-100 bg-gray-50/30" />
              ))}
              
              {/* Month days */}
              {monthDays.map(date => (
                <CalendarDay
                  key={date.toISOString()}
                  date={date}
                  events={getEventsForDate(date)}
                  isToday={isToday(date)}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                  onEventDrop={handleEventDrop}
                />
              ))}
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <DateYearPicker currentDate={currentDate} onDateChange={handleDateChange} />
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-sm font-medium hover:bg-blue-50 hover:border-blue-300"
          >
            Today
          </Button>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateEvent}
            className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToPrevMonth}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToNextMonth}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Content */}
      {renderCalendarContent()}

      {/* Event Dialog */}
      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={onAddEvent}
        onUpdate={onUpdateEvent}
        onDelete={onDeleteEvent}
        selectedDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  );
};
