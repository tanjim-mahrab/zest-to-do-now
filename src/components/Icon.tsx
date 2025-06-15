
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  if (!name) {
    console.warn(`Icon component received an undefined name. Falling back to Folder icon.`);
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  const nameMap: Record<string, IconName> = {
    home: 'Home',
    health: 'Heartbeat',
  };

  const lowerCaseName = name.toLowerCase();
  
  // 1. Check mapped names first (for special cases like 'health')
  let iconKey = nameMap[lowerCaseName];

  // 2. If no mapping, try the name as-is (e.g., 'Briefcase')
  if (!iconKey) {
    iconKey = name as IconName;
  }
  
  let LucideIcon = icons[iconKey];

  // 3. If that fails, try capitalizing the original name (for lowercase like 'book')
  if (!LucideIcon) {
    const pascalCaseName = name.charAt(0).toUpperCase() + name.slice(1);
    LucideIcon = icons[pascalCaseName as IconName];
  }

  if (!LucideIcon) {
    // If we still can't find it, log a warning and use a fallback icon.
    console.warn(`Icon "${name}" not found. Falling back to Folder icon.`);
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
