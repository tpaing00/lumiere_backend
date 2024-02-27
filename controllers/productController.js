const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Notification = require('../models/Notification');

const addProduct = async (req, res) => {
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
      unitCost,
      photo,
      expiryDate,
      periodAfterOpening,
      lowStockAlert,
      lowStockReminderTime,
      expirationReminder,
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
      barcodeId: barcodeNumber,
      productName: productName,
      brandName,
      unitPrice: parseFloat(unitPrice), // Convert string to number
      unitCost: parseFloat(unitCost), // Convert string to number
      addToCategory: addToCategory,
      photo,
      periodAfterOpening: parseInt(periodAfterOpening), // Convert string to integer
      stockQuantity: parseInt(stockQuantity), // Add stockQuantity to product
    };
    const product = new Product(productData);
    console.log("product data", product);
    await product.save();

    // Create Notification object
    const notificationData = {
      inventoryId: saveToInventory._id,
      lowStockAlert: lowStockAlert,
      lowStockReminderTime: parseInt(lowStockReminderTime),
      expirationReminder: expirationReminder,
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


const getProductList = (req, res) => {
  const id = req.params.id;
  if(typeof(id) == 'undefined') {
    Product.find({}).exec().then(results => {
      res.status(200).json(results);
    }).catch(error => {
      res.status(500).json(error)
    })
  }
}

// const searchProductList = (req, res) => {
//   console.log("inside search product list");
//   const { keywords, category, brandName, usage, status } = req.query;

//   let filter = {};

//   // Apply filters based on query parameters
//   if (category) {
//     filter.category = category;
//   }
//   if (brandName) {
//     filter.brandName = brandName;
//   }
//   if (usage) {
//     filter.usage = usage;
//   }
//   if (status) {
//     filter.status = status;
//   }

//   // Perform search based on keywords
//   let searchQuery = {};
//   if (keywords) {
//     searchQuery = {
//       $or: [
//         { productName: { $regex: keywords, $options: 'i' } } // Search productName for keywords
//       ],
//     };
//   }

//   // Combine filter and search queries
//   // const finalQuery = { ...filter, ...searchQuery };


//   Product.find(searchQuery)
//     .exec()
//     .then((results) => {
//       res.status(200).json(results);
//     })
//     .catch((error) => {
//       res.status(500).json(error);
//     });
// };
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
