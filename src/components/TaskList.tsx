import { useState } from 'react';
import { useTask, Task } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
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

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { deleteTask, toggleTask } = useTask();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task, index) => {
          return (
            <div
              key={task.id}
              onClick={() => navigate(`/task/${task.id}`)}
              className={`group relative bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 ease-in-out animate-slide-up flex items-center p-4 gap-4 cursor-pointer ${task.completed ? 'bg-zinc-50/70 opacity-70' : 'hover:shadow-md hover:border-gray-300/80'}`}
              style={{
                animationDelay: `${index * 0.05}s`
              }}
            >
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
                   <div className="flex-1">
                      <p className={`font-medium text-gray-800 break-all ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                      {task.description && <p className={`text-sm text-gray-500 mt-1 line-clamp-2 break-all ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.description}</p>}
                   </div>
                   <div className="flex-shrink-0 -mt-1 -mr-2" onClick={(e) => e.stopPropagation()}>
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
