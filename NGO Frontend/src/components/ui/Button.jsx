import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary text-white hover:bg-opacity-90',
  secondary: 'bg-secondary text-white hover:bg-opacity-90',
  accent: 'bg-accent text-white hover:bg-opacity-90',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
  danger: 'bg-red-600 text-white hover:bg-opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        rounded transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button; 