const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');
const http = require('http');
const socketIo = require('socket.io');
const { verifyToken, adminOnly } = require('./middlewares/authMiddleware');
const sendEmail = require('./utils/emailServices'); 
const FinancialRecord = require('./models/FinancialRecords');

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
}));

app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://maxhelp.onrender.com/', 
    methods: ['GET', 'POST'],
  }
});

// Socket.IO connection event (Consolidated)
io.on('connection', (socket) => {
  console.log('A user connected');

  // Low stock alert
  socket.on('low-stock-alert', (item) => {
    console.log('Low stock alert for item:', item);
    io.emit('low-stock-alert', item); // Notify all connected clients
  });

  // Feedback submitted
  socket.on('feedback-submitted', (feedback) => {
    console.log('Feedback submitted:', feedback);
    io.emit('feedback-submitted', feedback); // Notify all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Function to broadcast low stock alerts
const sendLowStockAlert = (item) => {
  io.emit('low-stock-alert', item); // Notify all connected clients
};

// Function to broadcast feedback notifications
const sendFeedbackNotification = (feedback) => {
  io.emit('feedback-submitted', feedback); // Notify all connected clients
};

// Schedule daily financial reports at 6 PM
cron.schedule('0 18 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records = await FinancialRecord.find({ date: { $gte: today } });

    const totalIncome = records.reduce((sum, record) => sum + record.amount, 0);
    const report = `Daily Financial Report:\n\nTotal Income: ₦${totalIncome.toFixed(2)}\nTransactions:\n`;

    const details = records
      .map(
        (record) => `Unit: ${record.unit}, Amount: ₦${record.amount}, Date: ${new Date(record.date).toLocaleString()}`
      )
      .join('\n');

    const emailText = report + details;

    await sendEmail('emelifonwuw@gmail.com', 'Daily Financial Report', emailText);
    console.log('Daily report email sent successfully');
  } catch (error) {
    console.error('Error sending daily report:', error.message);
  }
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/inventory', require('./routes/InventoryRoutes'));
app.use('/api/feedback', verifyToken, require('./routes/FeedbackRoutes')(io)); // Pass io to FeedbackRoutes
app.use('/api/financial', verifyToken, adminOnly, require('./routes/FinancialRoutes'));
app.use('/api/shortage', require('./routes/ReportShortage')(io));
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
