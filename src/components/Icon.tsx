
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

  // First, try to find the icon with the provided name as is.
  let LucideIcon = icons[name as IconName];

  // If the icon isn't found, it might be because it's a single word in lowercase (e.g., "home").
  // Let's try capitalizing the first letter and searching again.
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
