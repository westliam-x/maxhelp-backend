const ShortageReport = require('../models/ShortageReport'); 
const Inventory = require('../models/Inventory'); 

// Controller for reporting a shortage
exports.reportShortage = async (req, res, io) => {
  const { unit, message } = req.body;

  // Check if the unit and message are provided
  if (!unit || !message) {
    return res.status(400).json({ message: 'Unit and message are required.' });
  }

  try {
    // Save the shortage report to the database
    const shortageReport = new ShortageReport({
      unit,
      message,
      reportedAt: new Date(),
    });
    await shortageReport.save();

    // Emit a socket event to notify all connected clients about the shortage
    io.emit('shortage-reported', { unit, message });

    // Respond to the request
    res.status(201).json({ message: 'Shortage report submitted successfully.' });
  } catch (error) {
    console.error('Error reporting shortage:', error);
    res.status(500).json({ message: 'Failed to report shortage.' });
  }
};

// Controller for getting all shortage reports
exports.getreportShortage = async (req, res) => {
  try {
    const reports = await ShortageReport.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}