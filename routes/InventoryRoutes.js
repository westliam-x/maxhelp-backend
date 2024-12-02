const express = require('express');
const {
  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
} = require('../controllers/InventoryController');

const router = express.Router();

// Inventory routes
router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', addItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
