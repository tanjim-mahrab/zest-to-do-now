
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: IconName;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // Fallback to a default icon if name is not found
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
