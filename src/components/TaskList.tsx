
import { useTask, Task } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Check, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { projects, deleteTask, toggleTask } = useTask();
  const navigate = useNavigate();

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
  
  const formatTimeAgo = (date: Date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <ContextMenu key={task.id}>
          <ContextMenuTrigger>
            <Card 
              className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md hover:border-purple-500 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all duration-200 ease-in-out cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/task/${task.id}`)}
              tabIndex={0}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" 
                  style={{ backgroundColor: getProjectColor(task.projectId) }}
                >
                  <span className="text-white font-bold text-xl">
                    {getProjectName(task.projectId)?.charAt(0).toUpperCase() || ''}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-gray-800 truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                      {task.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">{tag}</span>
                      ))}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{getProjectName(task.projectId) || 'No Project'}</p>
                </div>

                {/* Right Section */}
                <div className="text-right flex-shrink-0 ml-auto pl-4">
                   <p className="text-sm text-gray-500 whitespace-nowrap">{formatTimeAgo(task.createdAt)}</p>
                </div>
              </div>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={(e) => { e.stopPropagation(); toggleTask(task.id) }}>
                <Check className="mr-2 h-4 w-4" />
                <span>{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/task/${task.id}`)}}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={(e) => { e.stopPropagation(); deleteTask(task.id)}} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
};

export default TaskList;
