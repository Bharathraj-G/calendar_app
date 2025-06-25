import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateYearPickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateYearPicker: React.FC<DateYearPickerProps> = ({ currentDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-3xl font-bold text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
        >
          {format(currentDate, 'MMMM yyyy')}
          <CalendarIcon className="ml-2 h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => {
            if (date) {
              onDateChange(date);
              setIsOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
