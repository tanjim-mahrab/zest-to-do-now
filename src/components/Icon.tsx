
import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div className="w-full h-full bg-gray-200 rounded-md animate-pulse" />;

type DynamicIconName = keyof typeof dynamicIconImports;

// This map normalizes various name formats to the correct kebab-case key
// used by lucide-react's dynamic imports.
const nameMap: Record<string, DynamicIconName> = {
  home: 'home',
  briefcase: 'briefcase',
  dumbbell: 'dumbbell',
  shoppingcart: 'shopping-cart',
  'shopping-cart': 'shopping-cart',
  book: 'book',
  plane: 'plane',
  health: 'heart-pulse',
  'heart-pulse': 'heart-pulse',
  dollarsign: 'dollar-sign',
  'dollar-sign': 'dollar-sign',
  shoppingbag: 'shopping-bag',
  'shopping-bag': 'shopping-bag',
  user: 'user',
  stethoscope: 'stethoscope',
  users: 'users',
  folder: 'folder',
};

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  const normalizedName = name ? name.toLowerCase().replace(/\s+/g, '') : 'folder';

  let iconKey: DynamicIconName = 'folder'; // Default to 'folder'

  // Check the map first for any aliases or common names
  if (nameMap[normalizedName]) {
    iconKey = nameMap[normalizedName];
  }
  // If not in the map, check if the normalized name is a valid icon key itself
  else if (dynamicIconImports[normalizedName as DynamicIconName]) {
    iconKey = normalizedName as DynamicIconName;
  }
  // If the icon is still not found, log a warning
  else {
    console.warn(`Icon component: Icon '${name}' not found. Falling back to 'folder'.`);
  }

  const LucideIcon = lazy(dynamicIconImports[iconKey]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
