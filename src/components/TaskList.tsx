
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTask, Task } from '@/contexts/TaskContext';
import { Calendar, Clock, Tag, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-orange-500 bg-orange-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isDueSoon = (date: Date) => {
    return isPast(date) || isToday(date);
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
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Card 
          key={task.id} 
          className="p-4 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 animate-slide-up cursor-pointer"
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => navigate(`/task/${task.id}`)}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <div className="pt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded-full data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              {/* Title and Priority */}
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold ${
                  task.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.priority !== 'low' && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className={`text-sm ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {/* Due Date */}
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${
                    isDueSoon(task.dueDate) && !task.completed 
                      ? 'text-red-500 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>{formatDueDate(task.dueDate)}</span>
                  </div>
                )}

                {/* Project */}
                {task.projectId && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: getProjectColor(task.projectId) }}
                    />
                    <span>{getProjectName(task.projectId)}</span>
                  </div>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{task.tags.slice(0, 2).join(', ')}</span>
                    {task.tags.length > 2 && <span>+{task.tags.length - 2}</span>}
                  </div>
                )}

                {/* Subtasks */}
                {task.subtasks.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
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
