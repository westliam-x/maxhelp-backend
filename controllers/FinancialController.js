const FinancialRecord = require('../models/FinancialRecords');

// Log a financial transaction
exports.logTransaction = async (req, res) => {
  const { unit, amount } = req.body;
  try {
    const record = new FinancialRecord({ unit, amount });
    await record.save();
    res.status(201).json({ message: 'Transaction logged successfully', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate financial reports
exports.getReports = async (req, res) => {
  const { unit, startDate, endDate } = req.query;
  try {
    const filter = {};
    if (unit) filter.unit = unit;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const records = await FinancialRecord.find(filter);
    const totalIncome = records.reduce((sum, record) => sum + record.amount, 0);

    res.json({ records, totalIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
