const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  unit: { type: String, enum: ['bookshop', 'restaurant', 'bottled-water'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
