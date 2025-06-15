
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTask } from '@/contexts/TaskContext';
import { Plus, FolderOpen, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import AddProjectModal from '@/components/AddProjectModal';
import { toast } from 'sonner';

const Projects = () => {
  const { projects, tasks, deleteProject } = useTask();
  const [showAddProject, setShowAddProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getTaskCount = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId && !task.completed).length;
  };

  const getCompletedCount = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId && task.completed).length;
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All tasks in this project will also be deleted.')) {
      deleteProject(projectId);
      toast.success('Project deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-black sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black">Projects</h1>
              <p className="text-gray-600">Organize your tasks by projects</p>
            </div>
            <Button
              onClick={() => setShowAddProject(true)}
              size="sm"
              className="bg-black text-white rounded-full w-10 h-10 p-0 hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-gray-50 border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {filteredProjects.length === 0 ? (
          <Card className="p-12 text-center border border-black bg-white shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-3">
              {searchQuery ? 'No projects found' : 'Create Your First Project'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms to find what you\'re looking for' 
                : 'Organize your tasks into projects to stay focused and productive'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddProject(true)}
                className="bg-black text-white rounded-xl px-8 py-3 text-base font-medium hover:bg-gray-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const activeCount = getTaskCount(project.id);
              const completedCount = getCompletedCount(project.id);
              const totalCount = activeCount + completedCount;
              const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              return (
                <Card 
                  key={project.id}
                  className="group relative p-6 border border-black bg-white hover:shadow-lg transition-all duration-300 animate-slide-up cursor-pointer hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/?project=${project.id}`)}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-black group-hover:text-black transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        <span className="font-semibold text-black">{activeCount}</span> active
                      </span>
                      <span className="text-gray-600">
                        <span className="font-semibold text-black">{completedCount}</span> completed
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    {totalCount > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-black h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-medium text-gray-600">
                            {Math.round(completionPercentage)}% complete
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {totalCount === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-400">No tasks yet</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <AddProjectModal open={showAddProject} onOpenChange={setShowAddProject} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Projects;
