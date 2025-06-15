
import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div className="w-5 h-5 bg-gray-200 rounded-md" />;

type DynamicIconName = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

// Mapping from PascalCase/custom names from iconList to kebab-case lucide names
const nameMap: Record<string, DynamicIconName> = {
    home: 'home',
    briefcase: 'briefcase',
    dumbbell: 'dumbbell',
    shoppingcart: 'shopping-cart',
    book: 'book',
    plane: 'plane',
    health: 'heart-pulse', // Using heart-pulse for "Health"
    dollarsign: 'dollar-sign',
    shoppingbag: 'shopping-bag',
    user: 'user',
    stethoscope: 'stethoscope',
    users: 'users',
    folder: 'folder',
};

const Icon = ({ name, ...props }: IconProps) => {
  if (!name) {
    const FallbackIcon = lazy(dynamicIconImports['folder']);
    return (
      <Suspense fallback={fallback}>
        <FallbackIcon {...props} />
      </Suspense>
    );
  }

  // Normalize name from AddProjectModal: remove spaces, lowercase.
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  
  // Find the kebab-case name, or default to 'folder'
  const iconName = nameMap[normalizedName] || 'folder';
  
  // Check if the icon name is valid before trying to import
  if (!dynamicIconImports[iconName]) {
    console.warn(`Icon "${name}" (resolved to "${iconName}") not found in dynamic imports. Falling back to folder.`);
    const LucideIcon = lazy(dynamicIconImports['folder']);
    return (
      <Suspense fallback={fallback}>
        <LucideIcon {...props} />
      </Suspense>
    );
  }

  const LucideIcon = lazy(dynamicIconImports[iconName]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
