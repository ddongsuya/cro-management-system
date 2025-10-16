import React, { ReactNode } from 'react';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  leftIcon, 
  rightIcon, 
  ...props 
}) => {
  const baseStyle = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 flex items-center justify-center';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary disabled:bg-gray-400',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400 disabled:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 disabled:bg-gray-400',
    ghost: 'bg-transparent text-brand-primary hover:bg-blue-50 focus:ring-brand-primary disabled:text-gray-400',
  };

  return (
    <button 
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input 
      id={id}
      className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm ${className}`}
      {...props} 
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
    {(title || actions) && (
      <div className="flex justify-between items-center mb-4">
        {title && <h3 className="text-xl font-semibold text-dark-text">{title}</h3>}
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin`}></div>
    </div>
  );
};