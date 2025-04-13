import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  name,
  type = 'text',
  placeholder = '',
  error = '',
  helperText = '',
  className = '',
  required = false,
  disabled = false,
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2 
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

export const TextArea = forwardRef(({ 
  label,
  name,
  placeholder = '',
  error = '',
  helperText = '',
  className = '',
  required = false,
  disabled = false,
  rows = 4,
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2 
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(({ 
  label,
  name,
  options = [],
  error = '',
  helperText = '',
  className = '',
  required = false,
  disabled = false,
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={name}
        name={name}
        disabled={disabled}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2 
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
TextArea.displayName = 'TextArea';
Select.displayName = 'Select';

export default Input; 