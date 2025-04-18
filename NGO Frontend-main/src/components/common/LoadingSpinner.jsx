import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'indigo' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const colorClasses = {
        indigo: 'text-indigo-600',
        white: 'text-white',
        gray: 'text-gray-600'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-t-2 border-b-2 border-current`}></div>
        </div>
    );
};

export default LoadingSpinner; 