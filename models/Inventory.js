const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  reorderLevel: { type: Number, default: 10 }, 
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema);
