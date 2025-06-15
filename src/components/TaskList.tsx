
import { useTask, Task } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { toggleTask, projects } = useTask();
  const navigate = useNavigate();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-orange-700 bg-orange-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isDueSoon = (date: Date) => {
    return isPast(date) && !isToday(date);
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null;
    const project = projects.find(p => p.id === projectId);
    return project?.name;
  };

  const getProjectColor = (projectId?: string) => {
    if (!projectId) return '#6C47FF';
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#6C47FF';
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <Card 
          key={task.id} 
          className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 ease-in-out animate-slide-up cursor-pointer"
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => navigate(`/task/${task.id}`)}
        >
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <div className="pt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="w-6 h-6 rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 transition-all hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2.5">
              {/* Title and Priority */}
              <div className="flex items-start justify-between gap-4">
                <h3 className={`font-bold text-lg -mt-1 ${
                  task.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.priority !== 'low' && (
                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className={`text-sm ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                } truncate`}>
                  {task.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 pt-1">
                {/* Due Date */}
                {task.dueDate && (
                  <div className={`flex items-center gap-1.5 ${
                    (isDueSoon(task.dueDate) || isToday(task.dueDate)) && !task.completed 
                      ? 'text-red-600 font-semibold' 
                      : 'text-gray-500'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                )}

                {/* Project */}
                {task.projectId && (
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: getProjectColor(task.projectId) }}
                    />
                    <span className="font-medium">{getProjectName(task.projectId)}</span>
                  </div>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    <div className="flex items-center gap-1.5">
                      {task.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs">{tag}</span>
                      ))}
                      {task.tags.length > 2 && <span className="text-gray-400 font-medium text-xs">+{task.tags.length - 2}</span>}
                    </div>
                  </div>
                )}

                {/* Subtasks */}
                {task.subtasks.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} done
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
