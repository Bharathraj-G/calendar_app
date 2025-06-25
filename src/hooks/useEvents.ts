import { useState, useEffect } from 'react';
import { Event, NewEvent } from '../types/Event';
import eventsData from '../data/events.json';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load events from JSON file and localStorage
    const loadEvents = () => {
      try {
        const savedEvents = localStorage.getItem('calendar-events');
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        } else {
          setEvents(eventsData as Event[]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents(eventsData as Event[]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadEvents, 100);
    return () => clearTimeout(timer);
  }, []);

  const saveToLocalStorage = (updatedEvents: Event[]) => {
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents));
  };

  const addEvent = (newEvent: NewEvent) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
  };

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
  };

  return { 
    events, 
    loading, 
    addEvent, 
    updateEvent, 
    deleteEvent 
  };
};
