// app_server/controllers/productController.js

const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    // Extract form data from JSON request body
    const {
      addToInventory,
      addToCategory,
      productName,
      brandName,
      stockQuantity,
      barcodeNumber,
      unitPrice,
      photo,
      expiryDate,
      periodAfterOpening
    } = req.body;

    // Create Inventory object
    const inventoryData = {
      inStore: addToInventory === 'true', // Convert string to boolean
      expirationDate: new Date(expiryDate), // Convert string to date
      stockQuantity: parseInt(stockQuantity), // Convert string to integer
    };
    const inventory = new Inventory(inventoryData);
    await inventory.save();

    // Create Product object
    const productData = {
      inventoryId: inventory._id, // Use the _id of the created inventory
      barcodeId: barcodeNumber,
      title: productName,
      brandName,
      unitPrice: parseFloat(unitPrice), // Convert string to number
      category: addToCategory,
      photo,
      shelfLife: parseInt(periodAfterOpening), // Convert string to integer
      stockQuantity: parseInt(stockQuantity), // Add stockQuantity to product
    };
    const product = new Product(productData);
    console.log("product data", product);
    await product.save();

    res.status(201).json({ product, inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
