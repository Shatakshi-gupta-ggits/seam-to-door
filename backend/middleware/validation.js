const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Booking validation
const validateBooking = [
  body('customerInfo.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('customerInfo.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one service item is required'),
  
  body('items.*.service')
    .isMongoId()
    .withMessage('Valid service ID is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('pickupAddress.houseNumber')
    .trim()
    .notEmpty()
    .withMessage('House number is required'),
  
  body('pickupAddress.streetArea')
    .trim()
    .notEmpty()
    .withMessage('Street/Area is required'),
  
  body('pickupAddress.place')
    .trim()
    .notEmpty()
    .withMessage('Place is required'),
  
  body('pickupAddress.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode'),
  
  body('pickupSchedule.date')
    .isISO8601()
    .withMessage('Please provide a valid pickup date'),
  
  body('pickupSchedule.timeSlot')
    .notEmpty()
    .withMessage('Time slot is required'),
  
  handleValidationErrors
];

// Service validation
const validateService = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service name must be between 2 and 100 characters'),
  
  body('category')
    .isIn(['male', 'female'])
    .withMessage('Category must be either male or female'),
  
  body('subcategory')
    .isIn(['top-wear', 'bottom-wear', 'ethnic-wear'])
    .withMessage('Subcategory must be top-wear, bottom-wear, or ethnic-wear'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('basePrice')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  
  body('image')
    .notEmpty()
    .withMessage('Service image is required'),
  
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  
  body('address.pincode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBooking,
  validateService,
  validateProfileUpdate,
  handleValidationErrors
};