// src/dao/models/Cart.js
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model('Cart', CartSchema);
