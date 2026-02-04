const mongoose = require('mongoose');

const serviceVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: String,
    default: '24-48 hours'
  }
});

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['male', 'female'],
    lowercase: true
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
    enum: ['top-wear', 'bottom-wear', 'ethnic-wear'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  variants: [serviceVariantSchema],
  image: {
    type: String,
    required: [true, 'Service image is required']
  },
  estimatedTime: {
    type: String,
    default: '24-48 hours'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ category: 1, subcategory: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ popularity: -1 });
serviceSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for minimum price
serviceSchema.virtual('minPrice').get(function() {
  if (this.variants && this.variants.length > 0) {
    return Math.min(...this.variants.map(v => v.price));
  }
  return this.basePrice;
});

// Virtual for maximum price
serviceSchema.virtual('maxPrice').get(function() {
  if (this.variants && this.variants.length > 0) {
    return Math.max(...this.variants.map(v => v.price));
  }
  return this.basePrice;
});

// Ensure virtuals are included in JSON output
serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

// Increment popularity when service is booked
serviceSchema.methods.incrementPopularity = function() {
  this.popularity += 1;
  return this.save();
};

module.exports = mongoose.model('Service', serviceSchema);