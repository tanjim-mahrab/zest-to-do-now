import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTask } from '@/contexts/TaskContext';
import { toast } from 'sonner';
import Icon from '@/components/Icon';
import { cn } from '@/lib/utils';

const iconList: { displayName: string; iconName: string }[] = [
  // General
  { displayName: 'Home', iconName: 'house' },
  { displayName: 'Book', iconName: 'book' },
  { displayName: 'User', iconName: 'user' },
  { displayName: 'Users', iconName: 'users' },
  
  // Health & Wellness
  { displayName: 'Dumbbell', iconName: 'dumbbell' },
  { displayName: 'Health', iconName: 'heart-pulse' },
  { displayName: 'Stethoscope', iconName: 'stethoscope' },
  { displayName: 'Meal', iconName: 'meal' },
  { displayName: 'Glass of Water', iconName: 'glass-water' },

  // Travel & Transport
  { displayName: 'Plane', iconName: 'plane' },
  { displayName: 'Bus', iconName: 'bus' },
  { displayName: 'Train', iconName: 'train-front' },
  { displayName: 'Fuel', iconName: 'fuel' },

  // Shopping & Finance
  { displayName: 'Shopping Cart', iconName: 'shopping-cart' },
  { displayName: 'Shopping Bag', iconName: 'shopping-bag' },
  { displayName: 'Dollar Sign', iconName: 'dollar-sign' },
  
  // Family
  { displayName: 'Baby', iconName: 'baby' },
];

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ open, onOpenChange }) => {
  const { addProject } = useTask();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>('house');

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
    setIcon('house');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-white border border-black rounded-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-bold text-black text-left">
            Create New Project
          </DialogTitle>
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
