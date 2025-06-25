import React from 'react';
import { Button } from '@/components/ui/button';

export type ViewType = 'day' | 'week' | 'month';

interface ViewSwitcherProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const views: { value: ViewType; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      {views.map((view) => (
        <Button
          key={view.value}
          variant={currentView === view.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view.value)}
          className={`
            px-4 py-2 text-sm font-medium transition-all duration-200
            ${currentView === view.value 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
};
