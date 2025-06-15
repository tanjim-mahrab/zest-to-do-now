
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

interface IconProps extends LucideProps {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  let pascalCaseName: string;

  if (name.includes('-')) {
    // Convert kebab-case to PascalCase (e.g., 'pie-chart' to 'PieChart')
    pascalCaseName = name.replace(/(^\w|-\w)/g, (g) => g.replace(/-/, "").toUpperCase());
  } else {
    // Ensure first letter is capitalized for single-word icons (e.g., 'home' to 'Home')
    pascalCaseName = name.charAt(0).toUpperCase() + name.slice(1);
  }
  
  const LucideIcon = icons[pascalCaseName as IconName];

  if (!LucideIcon) {
    // Fallback to a default icon if name is not found
    console.warn(`Icon "${name}" (parsed as "${pascalCaseName}") not found. Falling back to Folder icon.`);
    const FallbackIcon = icons['Folder'];
    return <FallbackIcon {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
