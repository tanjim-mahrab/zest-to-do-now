
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTask } from '@/contexts/TaskContext';
import { Plus, FolderOpen, MoreVertical, Edit, Trash2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-pink-50/30 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Organize your tasks by projects</p>
            </div>
            <Button
              onClick={() => setShowAddProject(true)}
              size="sm"
              className="gradient-purple-blue text-white rounded-full w-10 h-10 p-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl bg-gray-50 border-0"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {filteredProjects.length === 0 ? (
          <Card className="p-8 text-center border-0 bg-white/60 backdrop-blur-sm">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first project to organize your tasks'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddProject(true)}
                className="gradient-purple-blue text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project, index) => {
              const activeCount = getTaskCount(project.id);
              const completedCount = getCompletedCount(project.id);
              const totalCount = activeCount + completedCount;

              return (
                <Card 
                  key={project.id}
                  className="p-4 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 animate-slide-up cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/?project=${project.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{activeCount} active</span>
                          <span>{completedCount} completed</span>
                          {totalCount > 0 && (
                            <div className="flex-1 max-w-32">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="w-8 h-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
