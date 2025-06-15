
import { useTask, Task } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
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
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Card
          key={task.id}
          className={`group relative border rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out animate-slide-up border-l-4 ${task.completed ? 'bg-zinc-50' : 'bg-white'}`}
          style={{
            borderLeftColor: getProjectColor(task.projectId),
            animationDelay: `${index * 0.05}s`
          }}
        >
          <div className="p-4 flex items-start gap-4">
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
                className="w-5 h-5 rounded-full data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
              <p className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
              {task.description && <p className={`text-sm text-gray-500 mt-1 line-clamp-2 ${task.completed ? 'line-through' : ''}`}>{task.description}</p>}
              
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getProjectColor(task.projectId) }}></div>
                  <p className="truncate">{getProjectName(task.projectId) || 'No Project'}</p>
                </div>
                
                {task.tags.slice(0, 2).map(tag => (
                  <div key={tag} className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium whitespace-nowrap">{tag}</span>
                  </div>
                ))}

                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium whitespace-nowrap">{format(new Date(task.dueDate), 'MMM d')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute top-1 right-1">
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
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
