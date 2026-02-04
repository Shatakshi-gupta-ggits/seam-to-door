const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  paymentId: {
    type: String,
    unique: true,
    required: [true, 'Payment ID is required']
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    enum: ['cod', 'card', 'netbanking', 'wallet', 'upi'],
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  gateway: {
    type: String,
    enum: ['razorpay', 'paytm', 'phonepe', 'cod'],
    default: 'razorpay'
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  failureReason: {
    type: String,
    default: null
  },
  refundId: {
    type: String,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    default: null
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'failed'],
    default: 'none'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ booking: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Generate payment ID before saving
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.paymentId = `PAY-${timestamp}-${random}`;
  }
  next();
});

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason) {
  this.refundAmount = amount;
  this.refundReason = reason;
  this.refundStatus = 'pending';
  return this.save();
};

// Method to update payment status
paymentSchema.methods.updateStatus = function(status, gatewayResponse = {}) {
  this.status = status;
  this.gatewayResponse = { ...this.gatewayResponse, ...gatewayResponse };
  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);