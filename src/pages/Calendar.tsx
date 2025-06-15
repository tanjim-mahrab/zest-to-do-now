
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import AddTaskModal from '@/components/AddTaskModal';

const Calendar = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Calendar</h1>
              <p className="text-gray-600 text-lg">Plan and organize your tasks</p>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              className="bg-black text-white rounded-full w-14 h-14 p-0 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Modern Calendar */}
        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="w-10 h-10 p-0 text-black hover:bg-white rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-black" />
                <h2 className="text-xl font-bold text-black">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="w-10 h-10 p-0 text-black hover:bg-white rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <Button
                    key={day.toISOString()}
                    variant="ghost"
                    className={`h-16 p-2 flex flex-col items-center justify-center text-sm relative border border-transparent hover:border-gray-200 rounded-lg transition-all duration-200 ${
                      !isCurrentMonth 
                        ? 'text-gray-300 hover:text-gray-400' 
                        : isSelected 
                        ? 'bg-black text-white border-black shadow-sm' 
                        : isTodayDate
                        ? 'bg-gray-100 text-black border-gray-300 font-semibold'
                        : 'text-black hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className="text-base">{format(day, 'd')}</span>
                    {dayTasks.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-black'
                        }`} />
                        {dayTasks.length > 1 && (
                          <span className={`text-xs ${
                            isSelected ? 'text-white' : 'text-gray-600'
                          }`}>
                            +{dayTasks.length - 1}
                          </span>
                        )}
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Selected Date Tasks - Modern Design */}
        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isToday(selectedDate) ? 'bg-black text-white' : 'bg-gray-100 text-black'
                }`}>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-lg">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h3>
                  {isToday(selectedDate) && (
                    <p className="text-sm text-gray-600">Today</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-2">No tasks scheduled</h4>
                <p className="text-gray-500 mb-6">
                  {isToday(selectedDate) 
                    ? "You're all caught up for today!" 
                    : `No tasks planned for ${format(selectedDate, 'MMM d')}`
                  }
                </p>
                <Button
                  onClick={() => setShowAddTask(true)}
                  className="bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-base ${
                        task.completed ? 'line-through text-gray-500' : 'text-black'
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-sm mt-1 ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    {task.priority !== 'low' && (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {task.priority}
                      </div>
                    )}
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
