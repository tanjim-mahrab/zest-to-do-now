
import { useTask, Task } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Check, Edit, Trash2, MoreHorizontal, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

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
  
  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`group relative bg-white border border-gray-200/80 rounded-lg shadow-sm transition-all duration-300 ease-in-out animate-slide-up flex items-center p-3 gap-3 ${task.completed ? 'bg-zinc-50/70' : 'hover:shadow-md hover:border-gray-300/80'}`}
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
          <div 
            className="w-1 flex-shrink-0 self-stretch rounded-full" 
            style={{ backgroundColor: getProjectColor(task.projectId) }}
          />

          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleTask(task.id);
            }}
          >
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              className="w-5 h-5 rounded-full data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 focus:ring-offset-2 focus:ring-purple-400 transition-all"
            />
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
            <p className={`font-medium text-gray-800 truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
            {task.description && <p className={`text-sm text-gray-500 mt-0.5 line-clamp-1 ${task.completed ? 'line-through' : ''}`}>{task.description}</p>}
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-xs font-medium ml-auto pl-2">
            {task.tags.slice(0, 1).map(tag => (
              <div key={tag} className="hidden lg:flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{tag}</span>
              </div>
            ))}

            {task.dueDate && (
              <div className="hidden sm:flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}

            <div className="hidden xs:flex items-center gap-2 min-w-[80px] bg-gray-100/60 px-2 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getProjectColor(task.projectId) }}></div>
              <p className="truncate">{getProjectName(task.projectId) || 'No Project'}</p>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => toggleTask(task.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  <span>{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/task/${task.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
