import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Event, NewEvent } from '../types/Event';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: NewEvent) => void;
  onUpdate?: (eventId: string, event: Partial<Event>) => void;
  onDelete?: (eventId: string) => void;
  selectedDate?: Date;
  editingEvent?: Event | null;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  selectedDate,
  editingEvent,
}) => {
  const [formData, setFormData] = useState<NewEvent>({
    title: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting',
    description: '',
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        date: editingEvent.date,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        type: editingEvent.type,
        description: editingEvent.description || '',
      });
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd'),
        title: '',
        description: '',
      }));
    }
  }, [editingEvent, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent && onUpdate) {
      onUpdate(editingEvent.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingEvent && onDelete) {
      onDelete(editingEvent.id);
      onClose();
    }
  };

  const eventTypes = [
    { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
    { value: 'personal', label: 'Personal', color: 'bg-green-500' },
    { value: 'work', label: 'Work', color: 'bg-purple-500' },
    { value: 'reminder', label: 'Reminder', color: 'bg-yellow-500' },
    { value: 'schedule', label: 'Schedule', color: 'bg-orange-500' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Event Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Start Time
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors ${
                    formData.type === type.value
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="eventType"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      type: e.target.value as NewEvent['type'] 
                    }))}
                    className="sr-only"
                  />
                  <div className={`w-3 h-3 rounded-full ${type.color}`} />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add event description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {editingEvent && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Event
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};