
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTask } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Filter, Calendar, CheckCircle, Clock, Star } from 'lucide-react';
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
  const activeTasks = tasks.filter(task => !task.completed);

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

  const stats = [
    {
      label: 'Today',
      value: todayTasks.length,
      icon: Calendar
    },
    {
      label: 'Active',
      value: activeTasks.length,
      icon: Clock
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-black sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black">
                Good morning, {user?.name || 'User'}! ✨
              </h1>
              <p className="text-gray-600">Let's make today productive</p>
            </div>
            <Button 
              onClick={() => setShowAddTask(true)} 
              size="sm" 
              className="bg-black text-white rounded-full w-10 h-10 p-0 hover:bg-gray-800"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search tasks..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-10 h-12 rounded-xl bg-gray-50 border border-gray-300" 
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center border border-black bg-white">
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-black" />
              <p className="text-2xl font-bold text-black">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Tasks', count: tasks.length },
            { key: 'today', label: 'Today', count: todayTasks.length },
            { key: 'upcoming', label: 'Upcoming', count: upcomingTasks.length },
            { key: 'completed', label: 'Completed', count: completedTasks.length }
          ].map(tab => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(tab.key as any)}
              className={`flex-shrink-0 rounded-full ${
                filter === tab.key 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.key 
                    ? 'bg-white text-black' 
                    : 'bg-black text-white'
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
            <Card className="p-8 text-center border border-black bg-white">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchQuery 
                  ? 'No tasks found' 
                  : filter === 'completed' 
                    ? 'No completed tasks yet' 
                    : 'No tasks yet'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start by adding your first task'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowAddTask(true)} 
                  className="bg-black text-white rounded-xl hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Task
                </Button>
              )}
            </Card>
          ) : (
            <TaskList tasks={getFilteredTasks()} />
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
