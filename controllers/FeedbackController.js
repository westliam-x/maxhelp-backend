const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Submit feedback
exports.submitFeedback = async (req, res, io) => {
  const { message, rating } = req.body;
  const userId = req.user?.id; // Assuming middleware sets req.user from JWT

  try {
    const feedback = new Feedback({ user: userId, message, rating });
    await feedback.save();

    // Emit the feedback to all connected clients using Socket.IO
    io.emit('feedback-submitted', feedback); 
    
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
  res.status(500).json({ message: error.message });
  }
};


// Get all feedback (Admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('user', 'name email');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
