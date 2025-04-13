// middleware/errorHandler.js
 const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Something went wrong' : err.message;
    
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };

  export default errorHandler;