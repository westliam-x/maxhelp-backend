const express = require('express');
const { logTransaction, getReports } = require('../controllers/FinancialController');
const { verifyToken, adminOnly } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, adminOnly, logTransaction);
router.get('/reports', verifyToken, adminOnly, getReports); 

module.exports = router;
