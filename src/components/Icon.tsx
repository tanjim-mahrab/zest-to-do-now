
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  // Convert kebab-case to PascalCase (e.g., 'pie-chart' to 'PieChart')
  const pascalCaseName = name.replace(/(^\w|-\w)/g, (g) => g.replace(/-/, "").toUpperCase());

  const LucideIcon = icons[pascalCaseName as IconName];

  if (!LucideIcon) {
    // Fallback to a default icon if name is not found
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
