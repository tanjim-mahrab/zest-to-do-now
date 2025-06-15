
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

// Helper to convert kebab-case to PascalCase (e.g., 'shopping-cart' to 'ShoppingCart')
const kebabToPascalCase = (str: string) => {
  return str.replace(/(^\w|-\w)/g, (g) => g.replace(/-/, "").toUpperCase());
};

// Maps common names to the correct PascalCase component name from `lucide-react`
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
  const normalizedName = name ? name.toLowerCase().replace(/\s+/g, '') : 'folder';
  
  let iconComponentName = nameMap[normalizedName];
  
  // If the name is not in our specific map, try to convert it and check if it's a valid icon
  if (!iconComponentName) {
    const pascalCaseName = kebabToPascalCase(normalizedName);
    if (pascalCaseName in icons) {
      iconComponentName = pascalCaseName;
    }
  }

  const LucideIcon = iconComponentName ? icons[iconComponentName as keyof typeof icons] : undefined;

  // If the icon is still not found, render the fallback and log a warning
  if (!LucideIcon) {
    console.warn(`Icon component: Icon '${name}' not found. Falling back to 'Folder'.`);
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
