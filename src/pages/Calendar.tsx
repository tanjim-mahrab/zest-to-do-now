import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import AddTaskModal from '@/components/AddTaskModal';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const navigate = useNavigate();

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

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-500">Calendar</h2>
            <div className="flex items-center gap-1">
              <h2 className="text-lg font-bold text-black">
                {format(currentDate, 'MMM yyyy')}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="w-7 h-7">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="w-7 h-7">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, index) => (
                <div key={index} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-y-1">
              {calendarDays.map(day => {
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div key={day.toISOString()} className="aspect-square flex items-center justify-center">
                    <button
                      onClick={() => {
                        setSelectedDate(day);
                        if (!isSameMonth(day, currentDate)) {
                          setCurrentDate(day);
                        }
                      }}
                      className={`
                        h-11 w-11 relative rounded-full transition-colors duration-200
                        ${!isCurrentMonth ? 'text-gray-300 pointer-events-none' : ''}
                        ${isSelected ? 'bg-black text-white' : ''}
                        ${!isSelected && isCurrentMonth ? 'hover:bg-gray-100 text-gray-800' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full w-full gap-0.5">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${isTodayDate && !isSelected ? 'bg-sky-100 text-sky-700 font-semibold' : ''}`}>
                          {format(day, 'd')}
                        </span>
                        <div className="flex items-center justify-center space-x-0.5 h-1">
                          {dayTasks.length > 0 && isCurrentMonth && (
                            <>
                              {dayTasks.slice(0, 3).map((task) => (
                                <div key={task.id} className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? 'bg-white' : 'bg-gray-400'
                                }`} />
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
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
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
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
