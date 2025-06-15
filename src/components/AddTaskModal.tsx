
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTask, Task } from '@/contexts/TaskContext';
import { Calendar, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/Icon';

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  selectedDate?: Date;
}

const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onOpenChange, task, selectedDate }) => {
  const { addTask, updateTask, projects } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [projectId, setProjectId] = useState('none');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const isEditing = !!task;
  const selectedProject = projects.find((p) => p.id === projectId);

  useEffect(() => {
    // When the modal opens, synchronize the form state
    if (open) {
      if (isEditing && task) {
        // Editing an existing task: populate from task data
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate ? formatDateForInput(new Date(task.dueDate)) : '');
        setDueTime(task.dueDate ? new Date(task.dueDate).toTimeString().split(':').slice(0, 2).join(':') : '');
        setPriority(task.priority || 'medium');
        setProjectId(task.projectId || 'none');
        setTags(task.tags || []);
        setNewTag('');
      } else {
        // Adding a new task: reset to defaults and use selectedDate
        setTitle('');
        setDescription('');
        setDueDate(selectedDate ? formatDateForInput(selectedDate) : '');
        setDueTime('');
        setPriority('medium');
        setProjectId('none');
        setTags([]);
        setNewTag('');
      }
    }
  }, [open, task, isEditing, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    let finalDueDate: Date | undefined = undefined;
    if (dueDate) {
      // Create date from parts to avoid timezone issues with string parsing
      const [year, month, day] = dueDate.split('-').map(Number);
      
      let hours = 23, minutes = 59; // Default to end of day if no time is specified
      if (dueTime) {
        const [h, m] = dueTime.split(':').map(Number);
        hours = h;
        minutes = m;
      }
      // JS month is 0-indexed, so we subtract 1 from the month
      finalDueDate = new Date(year, month - 1, day, hours, minutes);
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: task?.completed || false,
      dueDate: finalDueDate,
      priority,
      tags,
      projectId: projectId === 'none' ? undefined : projectId,
      subtasks: task?.subtasks || [],
    };

    if (isEditing && task) {
      updateTask(task.id, taskData);
      toast.success('Task updated successfully!');
    } else {
      addTask(taskData);
      toast.success('Task added successfully!');
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setPriority('medium');
    setProjectId('none');
    setTags([]);
    setNewTag('');
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const quickDateOptions = [
    { label: 'Today', value: formatDateForInput(new Date()) },
    { label: 'Tomorrow', value: formatDateForInput(new Date(Date.now() + 86400000)) },
    { label: 'Next Week', value: formatDateForInput(new Date(Date.now() + 7 * 86400000)) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Quick Date Buttons */}
          <div className="space-y-2">
            <Label>Quick Date</Label>
            <div className="flex gap-2">
              {quickDateOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDueDate(option.value)}
                  className={`rounded-full ${dueDate === option.value ? 'bg-accent border' : ''}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Time</Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="h-12 rounded-xl"
                disabled={!dueDate}
              />
            </div>
          </div>

          {/* Priority & Project */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="h-12 rounded-xl">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {selectedProject && (
                      <Icon name={selectedProject.icon} className="h-4 w-4 flex-shrink-0" />
                    )}
                    <SelectValue placeholder="Select project" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <Icon name={project.icon} className="w-4 h-4" />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="h-10 rounded-xl"
              />
              <Button
                type="button"
                onClick={addTag}
                size="sm"
                className="px-3 rounded-xl"
                disabled={!newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <Button
                      type="button"
                      onClick={() => removeTag(tag)}
                      size="sm"
                      variant="ghost"
                      className="p-0 h-4 w-4 hover:bg-accent rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl"
            >
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
