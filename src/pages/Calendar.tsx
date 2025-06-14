
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import AddTaskModal from '@/components/AddTaskModal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

const Calendar = () => {
  const { user } = useAuth();
  const { tasks, getTodayTasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black">
                Calendar
              </h1>
              <p className="text-gray-600">View your tasks by date</p>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              size="sm"
              className="gradient-black-white text-white rounded-full w-10 h-10 p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Calendar Header */}
        <Card className="p-4 border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 p-0"
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
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {daysInMonth.map((day) => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 text-sm rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                    isSelected 
                      ? 'bg-black text-white' 
                      : isTodayDate 
                        ? 'bg-gray-200 text-black font-bold'
                        : 'text-gray-700 hover:text-black'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{format(day, 'd')}</span>
                    {dayTasks.length > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : 'bg-black'
                      }`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Selected Date Tasks */}
        <Card className="p-4 border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-black">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
          </div>
          
          {selectedDateTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tasks scheduled for this date</p>
              <Button
                onClick={() => setShowAddTask(true)}
                className="gradient-black-white text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500">
                        {format(new Date(task.dueDate), 'h:mm a')}
                      </p>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Calendar;
