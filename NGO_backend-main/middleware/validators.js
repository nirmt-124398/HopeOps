// middleware/validators.js
import Joi from 'joi';

export const validateRequest = (schema) => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }));
        
        return res.status(422).json({ 
          message: 'Validation failed',
          errors 
        });
      }
      
      next();
    };
  };


// Register Schema
export const registerSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.empty': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.empty': 'Password is required',
  }),
  role: Joi.string().valid('USER', 'NGO_ADMIN','SUPER_ADMIN').required().messages({
    'any.only': 'Role must be either USER or NGO_ADMIN or SUPER_ADMIN',
    'string.empty': 'Role is required',
  }),
});

// Login Schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Schema for creating an NGO
export const createNGOSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.empty': 'Name is required',
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.empty': 'Description is required',
  }),
  website: Joi.string().uri().required().messages({
    'string.uri': 'Website must be a valid URL',
    'string.empty': 'Website is required',
  }),
  contactEmail: Joi.string().email().required().messages({
    'string.email': 'Contact email must be a valid email address',
    'string.empty': 'Contact email is required',
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Phone number is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Address is required',
  }),
  logo: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Logo URL must be a valid URL'
  }),
  subscriptionId: Joi.string().optional().messages({
    'string.empty': 'Subscription ID cannot be empty if provided',
  }),
  planId: Joi.string().optional(),
  socialMedia: Joi.object({
    facebook: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'Facebook link must be a valid URL'
    }),
    twitter: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'Twitter link must be a valid URL'
    }),
    instagram: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'Instagram link must be a valid URL'
    }),
    linkedin: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'LinkedIn link must be a valid URL'
    }),
    youtube: Joi.string().uri().optional().allow('').messages({
      'string.uri': 'YouTube link must be a valid URL'
    })
  }).optional()
});

