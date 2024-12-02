const express = require('express');
const { submitFeedback, getAllFeedback } = require('../controllers/FeedbackController');
const { adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

// Pass `io` to the controller function properly
module.exports = (io) => {
  // Instead of invoking `submitFeedback(io)` here, just pass the reference of the function
  router.post('/', (req, res) => submitFeedback(req, res, io)); 
  router.get('/', adminOnly, getAllFeedback); 

  return router; // Make sure to return the router
};
