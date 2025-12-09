import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // thêm import này
import { TimelineHeaderProps } from '@/types/gantt';
import { months, statusButtons, getStatusButtonClassName } from '@/utils/ganttUtils';

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  currentStartDate,
  days,
  today,
  onNavigateDate,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex space-x-1">
          {statusButtons.map((status, index) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${getStatusButtonClassName(index)}`}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/admin/front-desk/check-available')}
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg bg-adminLayout-primary-500 hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Create booking</span>
        </button>
      </div>

      {/* Timeline Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigateDate('prev')}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="font-medium text-gray-900">
              {months[currentStartDate.getMonth()]} {currentStartDate.getFullYear()}
            </span>
          </div>

          <button
            onClick={() => onNavigateDate('next')}
            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="text-sm text-gray-500">Showing {days.length} days</div>
      </div>

      {/* Timeline Header */}
      <div className="grid grid-cols-12 border-b border-gray-200 bg-gray-50">
        {days.map((day, index) => (
          <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
            <div className="mb-1 text-xs text-gray-500">{months[day.getMonth()]}</div>
            <div
              className={`text-lg font-semibold ${
                day.toDateString() === today.toDateString()
                  ? 'text-blue-600 bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto'
                  : 'text-gray-900'
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineHeader;
