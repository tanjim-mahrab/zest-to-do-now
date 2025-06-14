
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
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active',
      value: activeTasks.length,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-pink-50/30 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, {user?.name || 'User'}! ✨
              </h1>
              <p className="text-gray-600">Let's make today productive</p>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              size="sm"
              className="gradient-purple-blue text-white rounded-full w-10 h-10 p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
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
              className="pl-10 h-12 rounded-xl bg-gray-50 border-0"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 border-0 bg-white/60 backdrop-blur-sm animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All Tasks', count: tasks.length },
            { key: 'today', label: 'Today', count: todayTasks.length },
            { key: 'upcoming', label: 'Upcoming', count: upcomingTasks.length },
            { key: 'completed', label: 'Completed', count: completedTasks.length },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(tab.key as any)}
              className={`flex-shrink-0 rounded-full ${
                filter === tab.key 
                  ? 'gradient-purple-blue text-white' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  filter === tab.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
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
            <Card className="p-8 text-center border-0 bg-white/60 backdrop-blur-sm">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchQuery 
                  ? 'No tasks found' 
                  : filter === 'completed' 
                    ? 'No completed tasks yet' 
                    : 'No tasks yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start by adding your first task'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowAddTask(true)}
                  className="gradient-purple-blue text-white rounded-xl"
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

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowAddTask(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full gradient-purple-blue text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-20"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Task Modal */}
      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
