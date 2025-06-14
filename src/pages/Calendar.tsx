import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import AddTaskModal from '@/components/AddTaskModal';

const Calendar = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-black sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">Calendar</h1>
              <p className="text-gray-600">View tasks by date</p>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              size="sm"
              className="bg-black text-white rounded-full w-10 h-10 p-0 hover:bg-gray-800"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Calendar Navigation */}
        <Card className="p-4 border border-black bg-white">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="text-black hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-black">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="text-black hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
            {calendarDays.map(day => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              
              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  className={`h-12 p-1 flex flex-col items-center justify-center text-xs relative ${
                    !isSameMonth(day, currentDate) 
                      ? 'text-gray-300' 
                      : isSelected 
                      ? 'bg-black text-white' 
                      : isTodayDate
                      ? 'bg-gray-200 text-black'
                      : 'text-black hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <span>{format(day, 'd')}</span>
                  {dayTasks.length > 0 && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : 'bg-black'
                    }`} />
                  )}
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Selected Date Tasks */}
        <Card className="border border-black bg-white">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-black">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
          </div>
          <div className="p-4">
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tasks scheduled for this date</p>
                <Button
                  onClick={() => setShowAddTask(true)}
                  className="bg-black text-white rounded-xl hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="w-4 h-4"
                      readOnly
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} />
      <BottomNavigation />
    </div>
  );
};

export default Calendar;
