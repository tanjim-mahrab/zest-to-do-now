
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTask } from '@/contexts/TaskContext';
import { toast } from 'sonner';

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colors = [
  '#6C47FF', '#00B5FF', '#FF68F0', '#34C759', '#FFA500', '#FF3B30',
  '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#EC4899'
];

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onOpenChange }) => {
  const { addProject } = useTask();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    addProject({
      name: name.trim(),
      color: selectedColor,
    });

    toast.success('Project created successfully!');
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedColor(colors[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Choose Color</Label>
            <div className="grid grid-cols-6 gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    selectedColor === color 
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedColor }}
              />
              <span className="font-medium">{name || 'Project Name'}</span>
            </div>
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
              className="flex-1 h-12 gradient-purple-blue text-white rounded-xl"
            >
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
