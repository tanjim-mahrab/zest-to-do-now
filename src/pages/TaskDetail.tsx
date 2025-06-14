
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useTask } from '@/contexts/TaskContext';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Tag, CheckCircle, Plus } from 'lucide-react';
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

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const addSubtask = () => {
    const title = prompt('Enter subtask title:');
    if (title?.trim()) {
      const newSubtask = {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
      };
      updateTask(task.id, { 
        subtasks: [...task.subtasks, newSubtask] 
      });
      toast.success('Subtask added successfully');
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
              <div className="flex-1">
                <h1 className={`text-2xl font-bold ${
                  task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h1>
                {task.description && (
                  <p className={`mt-2 ${
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

        {/* Subtasks */}
        <Card className="p-6 border-0 bg-white/60 backdrop-blur-sm animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
            </h2>
            <Button
              onClick={addSubtask}
              size="sm"
              variant="outline"
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {task.subtasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No subtasks yet</p>
              <Button
                onClick={addSubtask}
                variant="ghost"
                size="sm"
                className="mt-2 text-purple-600"
              >
                Add your first subtask
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {task.subtasks.map((subtask, index) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtask(subtask.id)}
                    className="w-4 h-4 rounded data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className={`flex-1 ${
                    subtask.completed 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-900'
                  }`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {task.subtasks.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round((task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
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
