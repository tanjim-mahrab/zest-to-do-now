
import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const fallback = <div className="w-5 h-5 bg-gray-200 rounded-md" />;

type DynamicIconName = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

// For backward compatibility with old data ('Home', 'ShoppingCart')
const nameMap: Record<string, string> = {
  home: 'home',
  briefcase: 'briefcase',
  dumbbell: 'dumbbell',
  shoppingcart: 'shopping-cart',
  book: 'book',
  plane: 'plane',
  health: 'heart-pulse',
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

  // Assume `name` is a valid kebab-case icon name first.
  let iconName = name as DynamicIconName;

  // If it's not a valid icon name, try mapping it from the old format for backward compatibility.
  if (!dynamicIconImports[iconName]) {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    iconName = (nameMap[normalizedName] || 'folder') as DynamicIconName;
  }
  
  // As a final check, if the icon name is still not valid, default to folder.
  if (!dynamicIconImports[iconName]) {
    iconName = 'folder' as DynamicIconName;
  }

  const LucideIcon = lazy(dynamicIconImports[iconName]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
