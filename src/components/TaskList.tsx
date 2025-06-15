import { useTask, Task, Project } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Check, Edit, Trash2, MoreHorizontal, Tag, Calendar, Clock } from 'lucide-react';
import { format, isToday } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Icon from './Icon';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { projects, deleteTask, toggleTask } = useTask();
  const navigate = useNavigate();

  const getProject = (projectId?: string): Project | undefined => {
    if (!projectId) return undefined;
    return projects.find(p => p.id === projectId);
  };
  
  const formatDueDate = (date: Date) => {
    const hasTime = date.getHours() !== 23 || date.getMinutes() !== 59;
    let dateText = '';
    if (isToday(date)) {
      dateText = 'Today';
    } else {
      dateText = format(date, 'MMM d');
    }

    return {
      date: dateText,
      time: hasTime ? format(date, 'h:mm a') : null,
      isUrgent: isToday(date)
    };
  };

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const project = getProject(task.projectId);
        const projectColor = project?.color || '#6b7280';
        const projectName = project?.name || 'No Project';
        const projectIcon = project?.icon || 'Folder';
        const dueDateInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

        return (
          <div
            key={task.id}
            className={`group relative bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 ease-in-out animate-slide-up flex items-start p-4 gap-4 ${task.completed ? 'bg-zinc-50/70 opacity-70' : 'hover:shadow-md hover:border-gray-300/80'}`}
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div className="flex-shrink-0 pt-0.5">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded-full data-[state=checked]:bg-black data-[state=checked]:border-black focus:ring-offset-2 focus:ring-black/50 transition-all"
              />
            </div>

            <div className="flex-1 min-w-0" >
              <div className="flex justify-between items-start gap-2">
                 <div className="flex-1 cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
                    <p className={`font-medium text-gray-800 break-words ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                    {task.description && <p className={`text-sm text-gray-500 mt-1 line-clamp-2 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.description}</p>}
                 </div>
                 <div className="flex-shrink-0 -mt-1 -mr-2">
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
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default TaskList;
