// models/ShortageReport.js
const mongoose = require('mongoose');

const shortageReportSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reportedAt: {
    type: Date,
    required: true,
  },
});

const ShortageReport = mongoose.model('ShortageReport', shortageReportSchema);

module.exports = ShortageReport;
