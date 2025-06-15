
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

  let iconName: DynamicIconName;

  // 1. Check if `name` is a direct valid key
  if (dynamicIconImports[name as DynamicIconName]) {
    iconName = name as DynamicIconName;
  } else {
    // 2. If not, normalize and check the map for backward compatibility
    const normalizedName = name.toLowerCase().replace(/\s+/g, '');
    const mappedName = nameMap[normalizedName];

    if (mappedName && dynamicIconImports[mappedName as DynamicIconName]) {
      iconName = mappedName as DynamicIconName;
    } else {
      // 3. Fallback to folder if no valid icon is found
      iconName = 'folder';
    }
  }

  const LucideIcon = lazy(dynamicIconImports[iconName]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
