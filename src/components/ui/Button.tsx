import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', icon: Icon, ariaLabel, onClick, className = ''
}) => {
  const baseClasses = 'group inline-flex items-center justify-center font-normal rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-wide font-body btn-magnetic';
  const variantClasses = {
    primary: 'bg-[#8B1A1A] text-[#F5EDD9] hover:bg-[#7A1717] focus:ring-[#8B1A1A]',
    secondary: 'bg-transparent text-[#8B1A1A] border border-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-[#F5EDD9] focus:ring-[#8B1A1A]'
  };
  const sizeClasses = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      {Icon && <Icon className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
};

export default Button;
