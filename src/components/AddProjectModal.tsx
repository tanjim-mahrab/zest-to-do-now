import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTask } from '@/contexts/TaskContext';
import { toast } from 'sonner';
import { FolderPlus } from 'lucide-react';
import Icon from '@/components/Icon';
import { cn } from '@/lib/utils';

const iconList: { displayName: string; iconName: string }[] = [
  { displayName: 'Home', iconName: 'house' },
  { displayName: 'Briefcase', iconName: 'briefcase' },
  { displayName: 'Dumbbell', iconName: 'dumbbell' },
  { displayName: 'Shopping Cart', iconName: 'shopping-cart' },
  { displayName: 'Book', iconName: 'book' },
  { displayName: 'Plane', iconName: 'plane' },
  { displayName: 'Health', iconName: 'heart-pulse' },
  { displayName: 'Dollar Sign', iconName: 'dollar-sign' },
  { displayName: 'Shopping Bag', iconName: 'shopping-bag' },
  { displayName: 'User', iconName: 'user' },
  { displayName: 'Stethoscope', iconName: 'stethoscope' },
  { displayName: 'Users', iconName: 'users' },
  { displayName: 'Folder', iconName: 'folder' },
];

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onOpenChange }) => {
  const { addProject } = useTask();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>('folder');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    addProject({
      name: name.trim(),
      color: '#000000', // Always use black
      icon,
    });

    toast.success('Project created successfully!');
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setIcon('folder');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-white border border-black rounded-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-black">
                Create New Project
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-base font-medium text-black">
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-2 border-gray-200 focus:border-black transition-colors text-base"
              required
              autoFocus
            />
          </div>

          {/* Icon Picker */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-black">Icon</Label>
            <div className="grid grid-cols-8 gap-2">
              {iconList.map(({ iconName }) => (
                <Button
                  key={iconName}
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIcon(iconName)}
                  className={cn(
                    "h-10 w-10 rounded-lg border-2 border-gray-200",
                    icon === iconName && "border-black ring-2 ring-black"
                  )}
                >
                  <Icon name={iconName} className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-black">Preview</Label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <Icon name={icon} className="w-5 h-5 text-black" />
              <span className="font-medium text-black truncate">
                {name || 'Your Project Name'}
              </span>
              <div className="w-4 h-4 bg-black rounded-full ml-auto flex-shrink-0" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:bg-gray-50 text-black font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-black text-white rounded-xl hover:bg-gray-800 font-medium"
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
