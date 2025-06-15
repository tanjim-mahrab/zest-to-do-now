import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Calendar, CheckCircle2, Clock, Star, Target } from 'lucide-react';
import TaskList from '@/components/TaskList';
import AddTaskModal from '@/components/AddTaskModal';
import BottomNavigation from '@/components/BottomNavigation';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, getTodayTasks, getUpcomingTasks } = useTask();
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');

  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const completedTasks = tasks.filter(task => task.completed);

  const getFilteredTasks = () => {
    let filtered = tasks;
    switch (filter) {
      case 'today':
        filtered = todayTasks;
        break;
      case 'upcoming':
        filtered = upcomingTasks;
        break;
      case 'completed':
        filtered = completedTasks;
        break;
      default:
        filtered = tasks;
    }
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filterTabs = [
    { key: 'all', label: 'All Tasks', count: tasks.length, icon: Target },
    { key: 'today', label: 'Today', count: todayTasks.length, icon: Calendar },
    { key: 'upcoming', label: 'Upcoming', count: upcomingTasks.length, icon: Clock },
    { key: 'completed', label: 'Completed', count: completedTasks.length, icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Good morning, {user?.name || 'User'}! 
                <span className="ml-2">✨</span>
              </h1>
              <p className="text-gray-600 text-lg">Let's make today productive</p>
            </div>
          </div>

          {/* Modern Search Bar */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input 
              placeholder="Search your tasks..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-12 pr-4 h-14 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-black text-base transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Modern Filter Tabs - Segmented Control */}
        <div className="bg-gray-100 p-1 rounded-full flex items-center space-x-1 border border-gray-200/80 shadow-sm">
          {filterTabs.map(tab => (
            <Button
              key={tab.key}
              variant="ghost"
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 h-auto rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                filter === tab.key 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-black hover:bg-white/60'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  filter === tab.key 
                    ? 'bg-black/5 text-black'
                    : 'bg-gray-200/70 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {getFilteredTasks().length === 0 ? (
            <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                {searchQuery 
                  ? 'No tasks found' 
                  : filter === 'completed' 
                    ? 'No completed tasks yet' 
                    : 'Ready to be productive?'
                }
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms to find what you\'re looking for' 
                  : 'Create your first task and start achieving your goals'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowAddTask(true)} 
                  className="bg-black text-white rounded-xl px-8 py-3 hover:bg-gray-800 font-medium"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Task
                </Button>
              )}
            </Card>
          ) : (
            <TaskList tasks={getFilteredTasks()} />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button 
        onClick={() => setShowAddTask(true)} 
        className="fixed z-30 top-6 right-6 bg-black text-white w-10 h-10 p-0 rounded-full hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center animate-bounce-check"
        aria-label="Add new task"
      >
        <Plus className="w-5 h-5" />
      </Button>

      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} />
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
