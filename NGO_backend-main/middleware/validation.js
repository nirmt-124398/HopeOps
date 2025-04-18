export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      console.log('Validation errors:', errors);
      
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

export default validateRequest;
