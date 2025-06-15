
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

// Helper to convert kebab-case to PascalCase (e.g., 'shopping-cart' to 'ShoppingCart')
const kebabToPascalCase = (str: string) => {
  return str.replace(/(^\w|-\w)/g, (g) => g.replace(/-/, "").toUpperCase());
};

// Maps old or alternative names to the correct PascalCase component name from `lucide-react`
const nameMap: Record<string, string> = {
  home: 'Home',
  briefcase: 'Briefcase',
  dumbbell: 'Dumbbell',
  shoppingcart: 'ShoppingCart',
  'shopping-cart': 'ShoppingCart',
  book: 'Book',
  plane: 'Plane',
  health: 'HeartPulse',
  'heart-pulse': 'HeartPulse',
  dollarsign: 'DollarSign',
  'dollar-sign': 'DollarSign',
  shoppingbag: 'ShoppingBag',
  'shopping-bag': 'ShoppingBag',
  user: 'User',
  stethoscope: 'Stethoscope',
  users: 'Users',
  folder: 'Folder',
};

const Icon = ({ name, ...props }: IconProps) => {
  // Use 'Folder' as a default if no name is provided
  if (!name) {
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }
  
  // Normalize the name to handle different cases and spacing
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  
  // Find the icon component name from our map, or convert it from kebab-case
  let iconComponentName = nameMap[normalizedName] || kebabToPascalCase(normalizedName);
  
  const LucideIcon = icons[iconComponentName as keyof typeof icons];

  // If the icon is not found in `lucide-react`, render the fallback
  if (!LucideIcon) {
    console.warn(`Icon not found: ${name} (resolved to ${iconComponentName})`);
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
