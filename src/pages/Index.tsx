import React from 'react';
import { Calendar } from '../components/Calendar';
import { useEvents } from '../hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { format, isAfter, startOfToday, parseISO } from 'date-fns';

const Index = () => {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents();
  const { toast } = useToast();

  const handleAddEvent = (newEvent: any) => {
    addEvent(newEvent);
    toast({
      title: "Event Created",
      description: `${newEvent.title} has been added to your calendar.`,
    });
  };

  const handleUpdateEvent = (eventId: string, updatedEvent: any) => {
    updateEvent(eventId, updatedEvent);
    toast({
      title: "Event Updated",
      description: "Your event has been successfully updated.",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    deleteEvent(eventId);
    toast({
      title: "Event Deleted",
      description: `${event?.title || 'Event'} has been removed from your calendar.`,
      variant: "destructive",
    });
  };

  // Get upcoming events (events that are today or in the future)
  const getUpcomingEvents = () => {
    const today = startOfToday();
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        return isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      })
      .sort((a, b) => {
        // Sort by date first, then by start time
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      })
      .slice(0, 5); // Show only next 5 upcoming events
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'personal':
        return 'bg-green-500';
      case 'work':
        return 'bg-purple-500';
      case 'reminder':
        return 'bg-yellow-500';
      case 'schedule':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Calendar Management
          </h1>
          <p className="text-gray-600 text-lg">
            Organize your schedule with ease - create, edit, and manage all your events
          </p>
        </div>
        
        <Calendar 
          events={events}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
        
        {/* Upcoming Events Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <span className="text-sm text-gray-500 capitalize">{event.type}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(parseISO(event.date), 'MMM dd, yyyy')} • {event.startTime} - {event.endTime}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No upcoming events</p>
              <p className="text-gray-400 text-sm mt-1">
                Click on any day to create your first event
              </p>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Click on any day to create an event, or click on existing events to edit or delete them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
