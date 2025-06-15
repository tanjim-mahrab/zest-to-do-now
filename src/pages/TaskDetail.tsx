import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useTask } from '@/contexts/TaskContext';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Shield, Folder } from 'lucide-react';
import { format } from 'date-fns';
import AddTaskModal from '@/components/AddTaskModal';
import { toast } from 'sonner';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, deleteTask, updateTask, projects } = useTask();
  const [showEditModal, setShowEditModal] = useState(false);
  
  const task = tasks.find(t => t.id === id);

  useEffect(() => {
    if (!task) {
      navigate('/');
    }
  }, [task, navigate]);

  if (!task) return null;

  const project = projects.find(p => p.id === task.projectId);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      toast.success('Task deleted successfully');
      navigate('/');
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(true)}
                className="text-gray-600 hover:text-purple-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Main Task Card */}
        <Card className="md:p-8 p-6 border-0 bg-white/60 backdrop-blur-sm animate-scale-in">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => updateTask(task.id, { completed: !task.completed })}
              className="w-6 h-6 rounded-full mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className={`text-2xl lg:text-3xl font-bold break-words ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h1>
              {task.description && (
                <p className={`mt-3 text-base break-words ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200/60">
            <div className="space-y-6">
              {/* Priority */}
              <div className="flex items-start gap-4">
                <div className="w-8 flex justify-center flex-shrink-0 pt-0.5">
                  <Shield className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 grid gap-1">
                  <p className="text-sm text-gray-500">Priority</p>
                  <div className={`px-3 py-0.5 inline-block self-start rounded-full text-sm font-medium ${getPriorityColor()}`}>
                    {task.priority}
                  </div>
                </div>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-start gap-4">
                  <div className="w-8 flex justify-center flex-shrink-0 pt-0.5">
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 grid gap-1">
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium text-gray-800">
                      {format(task.dueDate, 'EEEE, MMM d, yyyy')}
                      {task.dueDate.getHours() !== 23 && (
                        <span className="text-gray-500 font-normal"> at {format(task.dueDate, 'h:mm a')}</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Project */}
              {project && (
                <div className="flex items-start gap-4">
                  <div className="w-8 flex justify-center flex-shrink-0 pt-0.5">
                    <Folder className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 grid gap-1">
                    <p className="text-sm text-gray-500">Project</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-medium text-gray-800">{project.name}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="w-8 flex justify-center flex-shrink-0 pt-0.5">
                    <Tag className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 grid gap-1">
                    <p className="text-sm text-gray-500">Tags</p>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Task Modal */}
      <AddTaskModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        task={task}
      />
    </div>
  );
};

export default TaskDetail;
