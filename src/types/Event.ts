export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: 'meeting' | 'personal' | 'work' | 'reminder' | 'schedule';
  description?: string;
}

export interface NewEvent {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'personal' | 'work' | 'reminder' | 'schedule';
  description?: string;
}
