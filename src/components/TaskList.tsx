
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
import { Checkbox } from '@/components/ui/checkbox';

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
              className={`border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out animate-slide-up border-l-4 ${task.completed ? 'bg-gray-50 opacity-70' : 'bg-white'}`}
              style={{
                borderLeftColor: getProjectColor(task.projectId),
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
                <div
                  className="flex items-center h-full pt-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    className="w-5 h-5 rounded-full data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 focus:ring-purple-500"
                  />
                </div>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
                  <h3 className={`font-medium text-gray-800 truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1 text-sm text-gray-500">
                    <p className="truncate">{getProjectName(task.projectId) || 'No Project'}</p>
                    {task.tags.slice(0, 2).length > 0 && <span className="text-gray-300 hidden sm:inline">&middot;</span>}
                    <div className="flex items-center gap-1.5">
                      {task.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-auto pl-2 cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
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
