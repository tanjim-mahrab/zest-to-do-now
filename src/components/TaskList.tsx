
import { useState } from 'react';
import { useTask, Task } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, MoreHorizontal, Eye, Calendar, Tag, Flag } from 'lucide-react';
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
import AddTaskModal from '@/components/AddTaskModal';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/Icon';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { deleteTask, toggleTask, projects } = useTask();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-orange-100 text-orange-700 border-orange-200',
    low: 'bg-sky-100 text-sky-700 border-sky-200'
  };

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task, index) => {
          const isSelected = selectedTaskId === task.id;
          const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
          
          return (
            <div
              key={task.id}
              onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
              className={`group relative bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 ease-in-out animate-slide-up flex flex-col p-4 cursor-pointer ${task.completed ? 'bg-zinc-50/70 opacity-70' : 'hover:shadow-md hover:border-gray-300/80'}`}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded-full data-[state=checked]:bg-black data-[state=checked]:border-black focus:ring-offset-2 focus:ring-black/50 transition-all"
                  />
                </div>

                <div className="flex-1 min-w-0" >
                  <div className="flex justify-between items-start gap-2">
                     <div className="flex-1 min-w-0">
                        <p className={`font-medium text-gray-800 break-words ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                        {task.description && <p className={`text-sm text-gray-500 mt-1 break-words overflow-hidden ${!isSelected ? 'line-clamp-1' : ''} ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.description}</p>}
                     </div>
                     <div className="flex-shrink-0 -mt-1 -mr-2" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => navigate(`/task/${task.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
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
                </div>
              </div>

              {isSelected && (
                <div className="pl-9 pt-3 mt-3 border-t border-gray-100 space-y-3 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  {project && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Icon name={project.icon} className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{project.name}</span>
                    </div>
                  )}
                  {task.dueDate && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{format(new Date(task.dueDate), 'MMM d, yyyy, p')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <Badge variant="outline" className={`capitalize border ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
