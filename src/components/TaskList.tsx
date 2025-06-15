import { useState } from 'react';
import { useTask, Task, Project } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, MoreHorizontal, Tag, Calendar, Clock } from 'lucide-react';
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
import AddTaskModal from '@/components/AddTaskModal';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { projects, deleteTask, toggleTask } = useTask();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
    <>
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
                   <div className="flex-1">
                      <p className={`font-medium text-gray-800 break-all ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                      {task.description && <p className={`text-sm text-gray-500 mt-1 line-clamp-2 break-all ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.description}</p>}
                   </div>
                   <div className="flex-shrink-0 -mt-1 -mr-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => setEditingTask(task)}>
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
                
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500 font-medium">
                  {dueDateInfo && (
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-colors ${dueDateInfo.isUrgent ? 'bg-red-100 text-red-700' : 'border border-gray-200/80 hover:bg-gray-50'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dueDateInfo.date}</span>
                      {dueDateInfo.time && (
                        <>
                          <div className="w-px h-3 bg-gray-300 mx-0.5"></div>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{dueDateInfo.time}</span>
                        </>
                      )}
                    </div>
                  )}

                  {task.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1.5 border border-gray-200/80 px-2 py-0.5 rounded-full hover:bg-gray-50 transition-colors">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{tag}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 min-w-0 border border-gray-200/80 px-2 py-1 rounded-full hover:bg-gray-50 transition-colors">
                    {project ? (
                      <Icon name={projectIcon} className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-500"></div>
                    )}
                    <p className="truncate text-gray-700">{projectName}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <AddTaskModal
        open={!!editingTask}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingTask(null);
          }
        }}
        task={editingTask ?? undefined}
      />
    </>
  );
};

export default TaskList;
