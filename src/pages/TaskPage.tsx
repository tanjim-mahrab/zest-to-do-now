
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Edit, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Flag } from 'lucide-react';
import { format } from 'date-fns';
import AddTaskModal from '@/components/AddTaskModal';
import BottomNavigation from '@/components/BottomNavigation';
import { Badge } from '@/components/ui/badge';

const TaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, projects } = useTask();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const task = tasks.find(t => t.id === taskId);
  const project = task?.projectId ? projects.find(p => p.id === task.projectId) : null;

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Task not found</h2>
          <p className="text-gray-600 mb-6">The task you are looking for does not exist or has been deleted.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-orange-100 text-orange-700 border-orange-200',
    low: 'bg-sky-100 text-sky-700 border-sky-200'
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="p-4 sm:p-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4 text-gray-600 hover:text-black">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className={`text-2xl font-bold text-black ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</CardTitle>
                  {task.description && <CardDescription className="mt-2 text-gray-600 text-base">{task.description}</CardDescription>}
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowEditModal(true)} className="flex-shrink-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 border-t border-gray-100 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-center gap-3">
                  {task.completed ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-black">{task.completed ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>

                {task.dueDate && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium text-black">{format(new Date(task.dueDate), 'EEE, MMM d, yyyy')}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Flag className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <Badge variant="outline" className={`capitalize border ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                  </div>
                </div>
                
                {project && (
                   <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project</p>
                      <p className="font-medium text-black">{project.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <AddTaskModal open={showEditModal} onOpenChange={setShowEditModal} task={task} />
      <BottomNavigation />
    </>
  );
};

export default TaskPage;
