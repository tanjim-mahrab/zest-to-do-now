
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';

type DbTask = Database['public']['Tables']['tasks']['Row'];
type DbProject = Database['public']['Tables']['projects']['Row'];
type NewDbTask = Database['public']['Tables']['tasks']['Insert'];
type NewDbProject = Database['public']['Tables']['projects']['Insert'];

// Frontend interfaces - kept for backward compatibility
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  projectId?: string;
  subtasks: SubTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  taskCount: number;
}


// Mapping functions
const dbTaskToTask = (dbTask: DbTask): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description ?? undefined,
  completed: dbTask.completed,
  dueDate: dbTask.due_date ? new Date(dbTask.due_date) : undefined,
  priority: dbTask.priority,
  tags: dbTask.tags ?? [],
  projectId: dbTask.project_id ?? undefined,
  subtasks: (dbTask.subtasks as any as SubTask[]) ?? [],
  createdAt: new Date(dbTask.created_at),
  updatedAt: new Date(dbTask.updated_at),
});

const dbProjectToProject = (dbProject: DbProject, tasks: Task[]): Project => ({
    id: dbProject.id,
    name: dbProject.name,
    color: dbProject.color ?? '',
    icon: dbProject.icon ?? '',
    taskCount: tasks.filter(task => task.projectId === dbProject.id && !task.completed).length,
});


interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'taskCount'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getTasksByProject: (projectId?: string) => Task[];
  getTodayTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: dbTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: dbProjects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const tasks = useMemo(() => (dbTasks ?? []).map(dbTaskToTask), [dbTasks]);
  const projects = useMemo(() => (dbProjects ?? []).map(p => dbProjectToProject(p, tasks)), [dbProjects, tasks]);
  
  const addTaskMutation = useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!user) throw new Error("User not authenticated");
        const newDbTask: Omit<NewDbTask, 'user_id' | 'id' | 'created_at' | 'updated_at'> = {
            title: task.title,
            description: task.description,
            completed: task.completed,
            due_date: task.dueDate?.toISOString(),
            priority: task.priority,
            tags: task.tags,
            project_id: task.projectId,
            subtasks: task.subtasks as any,
        };
        const { error } = await supabase.from('tasks').insert({ ...newDbTask, user_id: user.id });
        if (error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
        const dbUpdates: Partial<NewDbTask> = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate?.toISOString() ?? null;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
        if (updates.subtasks !== undefined) dbUpdates.subtasks = updates.subtasks as any;

        const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id);
        if (error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'taskCount'>) => {
        if (!user) throw new Error("User not authenticated");
        const newDbProject: Omit<NewDbProject, 'user_id' | 'id' | 'created_at'> = {
            name: project.name,
            color: project.color,
            icon: project.icon,
        };
        const { error } = await supabase.from('projects').insert({ ...newDbProject, user_id: user.id });
        if(error) throw error;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
    },
  });
  
  const updateProjectMutation = useMutation({
      mutationFn: async ({ id, updates }: {id: string, updates: Partial<Project>}) => {
          const dbUpdates: Partial<NewDbProject> = {};
          if (updates.name !== undefined) dbUpdates.name = updates.name;
          if (updates.color !== undefined) dbUpdates.color = updates.color;
          if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
          const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
          if (error) throw error;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
      }
  });

  const deleteProjectMutation = useMutation({
      mutationFn: async (id: string) => {
          const { error } = await supabase.from('projects').delete().eq('id', id);
          if (error) throw error;
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
      }
  });


  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => addTaskMutation.mutate(task);
  const updateTask = (id: string, updates: Partial<Task>) => updateTaskMutation.mutate({ id, updates });
  const deleteTask = (id: string) => deleteTaskMutation.mutate(id);
  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if(task) {
      updateTask(id, { completed: !task.completed });
    }
  };
  const addProject = (project: Omit<Project, 'id' | 'taskCount'>) => addProjectMutation.mutate(project);
  const updateProject = (id: string, updates: Partial<Project>) => updateProjectMutation.mutate({id, updates});
  const deleteProject = (id: string) => deleteProjectMutation.mutate(id);

  const getTasksByProject = (projectId?: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) > today;
    }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  };
  
  const value = {
    tasks,
    projects,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addProject,
    updateProject,
    deleteProject,
    getTasksByProject,
    getTodayTasks,
    getUpcomingTasks,
    isLoading: isLoadingTasks || isLoadingProjects,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
