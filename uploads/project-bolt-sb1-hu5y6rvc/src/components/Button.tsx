import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  href,
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out';
  const variantStyles = {
    filled: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50',
    outlined: 'border-2 border-white text-white hover:bg-white hover:text-black',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  );
};
