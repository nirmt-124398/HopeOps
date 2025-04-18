/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error caught in global error handler:', err);
    
    // Authentication/authorization errors
    if (err.name === 'UnauthorizedError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required. Please log in again.',
            error: err.message
        });
    }
    
    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(422).json({ 
            success: false, 
            message: 'Validation error', 
            error: err.message,
            details: err.details
        });
    }
    
    // Default server error
    return res.status(500).json({ 
        success: false, 
        message: 'Internal server error', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

export default errorHandler;