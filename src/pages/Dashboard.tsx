
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
  const {
    user
  } = useAuth();
  const {
    tasks,
    getTodayTasks,
    getUpcomingTasks
  } = useTask();
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
      filtered = filtered.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  };
  const filterTabs = [{
    key: 'all',
    label: 'All Tasks',
    count: tasks.length,
    icon: Target
  }, {
    key: 'today',
    label: 'Today',
    count: todayTasks.length,
    icon: Calendar
  }, {
    key: 'upcoming',
    label: 'Upcoming',
    count: upcomingTasks.length,
    icon: Clock
  }, {
    key: 'completed',
    label: 'Completed',
    count: completedTasks.length,
    icon: CheckCircle2
  }];

  return <div className="h-screen bg-gray-50 flex flex-col">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 z-10 shadow-sm flex-shrink-0">
        <div className="px-4 sm:px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.email?.split('@')[0] || 'friend'}!
              </h1>
              <p className="text-gray-500 mt-1">
                You have {tasks.filter(t => !t.completed).length} tasks remaining.
              </p>
            </div>
            <Button 
              onClick={() => setShowAddTask(true)} 
              className="bg-black text-white w-10 h-10 p-0 rounded-full hover:bg-gray-800 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center animate-scale-in flex-shrink-0" 
              aria-label="Add new task">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Modern Search Bar */}
          <div className="relative">
            <Input 
              placeholder="Search tasks..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="h-14 w-full rounded-full border bg-gray-50/50 pl-6 pr-16 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow overflow-y-auto">
        <div className="px-4 sm:px-6 py-8 space-y-8 pb-20">
          {/* Modern Filter Tabs - Segmented Control */}
          <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="bg-gray-100 p-1 rounded-full flex items-center space-x-1 border border-gray-200/80 shadow-sm min-w-max">
              {filterTabs.map(tab => <Button key={tab.key} variant="ghost" onClick={() => setFilter(tab.key as any)} className={`flex-shrink-0 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 h-auto rounded-full text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${filter === tab.key ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black hover:bg-white/60'}`}>
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="inline xs:hidden">{tab.label.split(' ')[0]}</span>
                  {tab.count > 0 && <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-black/5 text-black' : 'bg-gray-200/70 text-gray-600'}`}>
                      {tab.count}
                    </span>}
                </Button>)}
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {getFilteredTasks().length === 0 ? <Card className="p-12 text-center bg-white border border-gray-200 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {searchQuery ? 'No tasks found' : filter === 'completed' ? 'No completed tasks yet' : 'Ready to be productive?'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {searchQuery ? 'Try adjusting your search terms to find what you\'re looking for' : 'Create your first task and start achieving your goals'}
                </p>
                {!searchQuery && <Button onClick={() => setShowAddTask(true)} className="bg-black text-white rounded-xl px-8 py-3 hover:bg-gray-800 font-medium">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Task
                  </Button>}
              </Card> : <TaskList tasks={getFilteredTasks()} />}
          </div>
        </div>
      </main>

      {/* Floating Action Button has been moved to the header */}

      <AddTaskModal open={showAddTask} onOpenChange={setShowAddTask} />
      <BottomNavigation />
    </div>;
};
export default Dashboard;
