// routes/shortageRoutes.js
const express = require('express');
const { reportShortage, getreportShortage } = require('../controllers/ShortageController');
const { adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

module.exports = (io) => {
  // Endpoint to report a shortage
  router.post('/report-shortage', (req, res) => reportShortage(req, res, io));
  router.get('/report-shortage',adminOnly, getreportShortage);

  return router;
};
