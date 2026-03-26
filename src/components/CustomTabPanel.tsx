import { ReactNode } from 'react';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
  className?: string;
}

export default function CustomTabPanel({
  children,
  value,
  index,
  className,
}: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={className}
    >
      {value === index && children}
    </div>
  );
}
