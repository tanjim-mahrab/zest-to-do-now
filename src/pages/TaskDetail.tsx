import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useTask } from '@/contexts/TaskContext';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Tag } from 'lucide-react';
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
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-orange-500 bg-orange-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
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
        <Card className="p-6 border-0 bg-white/60 backdrop-blur-sm animate-scale-in">
          <div className="space-y-4">
            {/* Title and Status */}
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => updateTask(task.id, { completed: !task.completed })}
                className="w-6 h-6 rounded-full mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <div className="flex-1 min-w-0">
                <h1 className={`text-2xl font-bold ${
                  task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h1>
                {task.description && (
                  <p className={`mt-2 break-words ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor()}`}>
                  {task.priority} priority
                </div>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{format(task.dueDate, 'MMM d, yyyy')}</span>
                  {task.dueDate.getHours() !== 23 && (
                    <>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{format(task.dueDate, 'h:mm a')}</span>
                    </>
                  )}
                </div>
              )}

              {/* Project */}
              {project && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Created {format(task.createdAt, 'MMM d, yyyy')}</span>
              </div>
            </div>

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500" />
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
