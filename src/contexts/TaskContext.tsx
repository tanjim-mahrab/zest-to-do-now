
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  taskCount: number;
}

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Personal', color: '#6C47FF', taskCount: 0 },
    { id: '2', name: 'Work', color: '#00B5FF', taskCount: 0 },
    { id: '3', name: 'Shopping', color: '#FF68F0', taskCount: 0 },
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedProjects = localStorage.getItem('projects');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
      setTasks(parsedTasks);
    }
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save to localStorage whenever tasks or projects change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    updateProjectTaskCount();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
    updateProjectTaskCount();
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    updateProjectTaskCount();
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
    ));
  };

  const addProject = (projectData: Omit<Project, 'id' | 'taskCount'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      taskCount: 0,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    // Also delete tasks in this project
    setTasks(prev => prev.filter(task => task.projectId !== id));
  };

  const updateProjectTaskCount = () => {
    setProjects(prev => prev.map(project => ({
      ...project,
      taskCount: tasks.filter(task => task.projectId === project.id && !task.completed).length
    })));
  };

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

  return (
    <TaskContext.Provider value={{
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
    }}>
      {children}
    </TaskContext.Provider>
  );
};
