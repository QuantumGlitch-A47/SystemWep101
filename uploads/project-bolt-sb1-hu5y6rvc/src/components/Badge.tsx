import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, icon, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
