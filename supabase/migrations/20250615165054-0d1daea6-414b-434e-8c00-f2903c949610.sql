
-- Create a custom type for task priority levels
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- Create a table to store user projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Add Row Level Security (RLS) to ensure users can only access their own projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- Create a policy for full project management by the owner
CREATE POLICY "Users can manage their own projects"
  ON public.projects
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a table to store tasks
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date TIMESTAMP WITH TIME ZONE,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  tags TEXT[],
  subtasks JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
-- Add Row Level Security (RLS) to ensure users can only access their own tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- Create a policy for full task management by the owner
CREATE POLICY "Users can manage their own tasks"
  ON public.tasks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a function to automatically update the 'updated_at' timestamp on any change
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to execute the function when a task is updated
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
