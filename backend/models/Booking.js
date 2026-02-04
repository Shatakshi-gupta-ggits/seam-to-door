const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required']
  },
  variant: {
    name: String,
    price: Number
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  }
});

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: [true, 'Booking number is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [bookingItemSchema],
  pickupAddress: {
    houseNumber: { type: String, required: true },
    streetArea: { type: String, required: true },
    place: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid pincode']
    },
    mapLink: String
  },
  pickupSchedule: {
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }
  },
  deliveryAddress: {
    houseNumber: String,
    streetArea: String,
    place: String,
    pincode: String,
    mapLink: String,
    sameAsPickup: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'pickup_scheduled',
      'picked_up',
      'in_progress',
      'quality_check',
      'ready_for_delivery',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'wallet'],
    default: 'cod'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  finalAmount: {
    type: Number,
    required: [true, 'Final amount is required'],
    min: [0, 'Final amount cannot be negative']
  },
  assignedTailor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: {
    type: Date,
    default: null
  },
  notes: {
    customer: String,
    tailor: String,
    admin: String
  },
  images: {
    before: [String],
    after: [String]
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: String,
    date: Date
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  isUrgent: {
    type: Boolean,
    default: false
  },
  urgentCharges: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ customer: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ assignedTailor: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'pickupSchedule.date': 1 });

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Count bookings for today to generate sequential number
    const todayStart = new Date(year, date.getMonth(), date.getDate());
    const todayEnd = new Date(year, date.getMonth(), date.getDate() + 1);
    
    const todayBookingsCount = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const sequentialNumber = String(todayBookingsCount + 1).padStart(4, '0');
    this.bookingNumber = `MRF-${year}${month}${day}-${sequentialNumber}`;
  }
  next();
});

// Add status to timeline before saving
bookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  next();
});

// Calculate estimated delivery based on items
bookingSchema.pre('save', function(next) {
  if (!this.estimatedDelivery && this.items.length > 0) {
    // Default to 48 hours from pickup date
    const pickupDate = new Date(this.pickupSchedule.date);
    const estimatedHours = this.isUrgent ? 24 : 48;
    this.estimatedDelivery = new Date(pickupDate.getTime() + (estimatedHours * 60 * 60 * 1000));
  }
  next();
});

// Method to update status
bookingSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status changed to ${newStatus}`,
    updatedBy
  });
  return this.save();
};

// Method to calculate total amount
bookingSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  this.finalAmount = this.totalAmount - this.discountAmount + this.urgentCharges;
  return this;
};

module.exports = mongoose.model('Booking', bookingSchema);