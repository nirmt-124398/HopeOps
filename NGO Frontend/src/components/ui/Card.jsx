import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  bordered = false,
  shadow = 'md',
  ...props 
}) => {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden
        ${bordered ? 'border border-gray-200' : ''}
        ${shadowClasses[shadow]}
        ${hoverable ? 'hover:shadow-lg transition-shadow duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 