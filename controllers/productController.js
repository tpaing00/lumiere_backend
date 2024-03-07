const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const firebaseAdmin = require('../models/Firebase.js');

const { Readable } = require('stream');



const bucket = firebaseAdmin.storage().bucket();


const addProduct = async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.files", req.files);

  try {
    // Extract form data from JSON request body
    const {
      userId,
      addToInventory,
      category,
      productName,
      brandName,
      stockQuantity,
      barcodeNumber,
      unitPrice,
      expiryDate,
      periodAfterOpening,
      isLowStockAlert,
      lowStockThreshold,
      isExpirationReminder,
      expirationReminderTime
    } = req.body;

    const photoFiles = req.files;
    if (!photoFiles || photoFiles.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded' });
    }


    const photoUrls = [];

    
    for (const photoFile of photoFiles) {
      // Upload the file buffer to Firebase Storage
      const file = bucket.file(`productPhotos/${photoFile.originalname}`);
      const uploadResult = await file.save(photoFile.buffer, {
        contentType: photoFile.mimetype
      });

      console.log("upload result", uploadResult);

      // Get the download URL of the uploaded file
  const [downloadUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2025' // Set an expiration date for the URL if needed
  });
  console.log("download url", downloadUrl);

  if (downloadUrl) {
    photoUrls.push(downloadUrl);
  } else {
    console.error('Error getting download URL');
  }
    }


    // Create Inventory object
    const inventoryData = {
      userId,
      barcodeNumber,
      addToInventory: addToInventory, // Convert string to boolean
      expiryDate: new Date(expiryDate), // Convert string to date
      stockQuantity: parseInt(stockQuantity),// Convert string to integer
      totalValue: parseFloat(unitPrice * stockQuantity) // Convert string to number 
    };
    const inventory = new Inventory(inventoryData);
    const saveToInventory = await inventory.save();

    // Create Product object
    const productData = {
      barcodeNumber: barcodeNumber,
      productName: productName,
      brandName,
      unitPrice: parseFloat(unitPrice), // Convert string to number
      category: category,
      photo:photoUrls,
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
      let results = await Product.find({ barcodeNumber: id}).exec();
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
    filter.category = category;
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
