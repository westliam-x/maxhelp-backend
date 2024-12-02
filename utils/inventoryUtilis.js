const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/emailServices');

// Function to check inventory and send alerts if stock is low
const checkInventoryLevels = async () => {
  try {
    const items = await Inventory.find();
    items.forEach((item) => {
      if (item.quantity <= item.reorderLevel) {
        // Send low stock alert to admin
        sendLowStockAlert(item);
      }
    });
  } catch (error) {
    console.error('Error checking inventory levels:', error.message);
  }
};

// Send low stock email alert
const sendLowStockAlert = (item) => {
  const emailText = `Alert: The item '${item.name}' has low stock (Current: ${item.quantity}, Reorder Level: ${item.reorderLevel}). Please consider reordering.`;
  sendEmail('admin@example.com', 'Low Stock Alert', emailText);
};

module.exports = { checkInventoryLevels, sendLowStockAlert };
