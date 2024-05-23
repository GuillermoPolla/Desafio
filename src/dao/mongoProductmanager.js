// src/dao/MongoProductManager.js
const Product = require('./models/Product');

class MongoProductManager {
  async addProduct(product) {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async getProducts() {
    return await Product.find();
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async updateProduct(id, product) {
    return await Product.findByIdAndUpdate(id, product, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = MongoProductManager;
