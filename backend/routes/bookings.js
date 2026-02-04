const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all bookings for a user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('services.serviceId', 'name price')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get a specific booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    })
    .populate('services.serviceId', 'name price description')
    .lean();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create a new booking
router.post('/', [
  auth,
  body('customerName').trim().isLength({ min: 2 }).withMessage('Customer name is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid phone number is required'),
  body('address.houseNumber').trim().notEmpty().withMessage('House number is required'),
  body('address.streetArea').trim().notEmpty().withMessage('Street/Area is required'),
  body('address.place').trim().notEmpty().withMessage('Place is required'),
  body('address.pincode').isPostalCode('IN').withMessage('Valid pincode is required'),
  body('pickupDate').isISO8601().withMessage('Valid pickup date is required'),
  body('pickupTime').notEmpty().withMessage('Pickup time is required'),
  body('services').isArray({ min: 1 }).withMessage('At least one service is required'),
  body('services.*.serviceId').isMongoId().withMessage('Valid service ID is required'),
  body('services.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  body('services.*.variant').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerName,
      phone,
      phone2,
      address,
      pickupDate,
      pickupTime,
      services,
      mapLink,
      totalAmount
    } = req.body;

    // Generate booking number
    const bookingNumber = `MRF-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const booking = new Booking({
      bookingNumber,
      userId: req.user.id,
      customerName,
      phone,
      phone2,
      address,
      pickupDate: new Date(pickupDate),
      pickupTime,
      services,
      mapLink,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    // Populate services for response
    await booking.populate('services.serviceId', 'name price description');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: booking.toObject()
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'in_progress', 'completed', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('services.serviceId', 'name price');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only allow cancellation if booking is not yet picked up
    if (['picked_up', 'in_progress', 'completed', 'delivered'].includes(booking.status)) {
      return res.status(400).json({ error: 'Cannot cancel booking at this stage' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Request faster delivery
router.patch('/:id/faster-delivery', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only allow faster delivery request for certain statuses
    if (!['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'in_progress'].includes(booking.status)) {
      return res.status(400).json({ error: 'Cannot request faster delivery at this stage' });
    }

    // Add faster delivery charge
    booking.fasterDelivery = true;
    booking.totalAmount += 50; // Add ₹50 for faster delivery
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      message: 'Faster delivery requested successfully. Additional ₹50 will be charged.',
      booking
    });
  } catch (error) {
    console.error('Error requesting faster delivery:', error);
    res.status(500).json({ error: 'Failed to request faster delivery' });
  }
});

module.exports = router;