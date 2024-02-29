const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

const addProduct = async (req, res) => {
  try {
    // Extract form data from JSON request body
    const {
      addToInventory,
      category,
      productName,
      brandName,
      stockQuantity,
      barcodeNumber,
      unitPrice,
      totalValue,
      photo,
      expiryDate,
      periodAfterOpening,
      isLowStockAlert,
      lowStockThreshold,
      isExpirationReminder,
      expirationReminderTime
    } = req.body;


    // Create Inventory object
    const inventoryData = {
      addToInventory: addToInventory, // Convert string to boolean
      expiryDate: new Date(expiryDate), // Convert string to date
      stockQuantity: parseInt(stockQuantity), // Convert string to integer
    };
    const inventory = new Inventory(inventoryData);
    const saveToInventory = await inventory.save();

    // Create Product object
    const productData = {
      inventoryId: saveToInventory._id, // Use the _id of the created inventory
      barcodeNumber: barcodeNumber,
      productName: productName,
      brandName,
      unitPrice: parseFloat(unitPrice), // Convert string to number
      totalValue: parseFloat(totalValue), // Convert string to number
      category: category,
      photo,
      periodAfterOpening: parseInt(periodAfterOpening), // Convert string to integer
    };
    const product = new Product(productData);
    console.log("product data", product);
    await product.save();

    // Create Notification object
    const notificationData = {
      inventoryId: saveToInventory._id,
      isLowStockAlert: isLowStockAlert,
      lowStockThreshold: parseInt(lowStockThreshold),
      isExpirationReminder: isExpirationReminder,
      expirationReminderTime: parseInt(expirationReminderTime)
    };

    const notification = new Notification(notificationData);
    await notification.save();

    res.status(201).json({ product, inventory, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getProductList = async(req, res) => {
  const id = req.params.id;

  try {
    // send all product list
    if(typeof(id) == 'undefined') {
        let results = await Product.find({}).exec();
        if(results !== null) {
            res.status(200).json(results);
        }
    } else {
      // send the product with barcode
      let results = await Product.find({ barcodeId: id}).exec();
      if(results !== null) {
          res.status(200).json(results);
      }
    }
  } catch(error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
}


const searchProductList = (req, res) => {
  console.log("inside search product list");
  const { keywords, category, brandName, usage, status } = req.query;

  let filter = {};

  // Apply filters based on query parameters
  if (category) {
    filter.addToCategory = category;
  }
  if (brandName) {
    filter.brandName = brandName;
  }
  // if (usage) {
  //   filter.usage = usage;
  // }
  // if (status) {
  //   filter.status = status;
  // }

  // Construct search query
  let searchQuery = {};
  if (keywords) {
    const keywordArray = keywords.split(" "); // Split keywords by space
    const keywordRegexArray = keywordArray.map(keyword => new RegExp(keyword, 'i')); // Create regex for each keyword
    searchQuery = {
      $or: [
        { productName: { $in: keywordRegexArray } },
        { addToCategory: { $in: keywordRegexArray } },
        { brandName: { $in: keywordRegexArray } }
      ]
    };
  }

  // Combine filter and search queries
  const finalQuery = { ...filter, ...searchQuery };
  
  console.log("Search query:", finalQuery); // Log the final search query

  Product.find(finalQuery)
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};


module.exports = {
  addProduct,
  getProductList,
  searchProductList
}
