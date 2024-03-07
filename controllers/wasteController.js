const Waste = require("../models/Waste");
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

const getWaste = (req, res) => {
    const id = req.params.id;
    if (typeof id == "undefined") {
        Waste.find({})
        .exec()
        .then((results) => {
          res.status(200).json(results);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    } else {
        Waste.findOne({ _id: id }).exec()
        .then((results) => {
          if (results == null) {
            res.status(404).json(results);
          } else {
            res.status(200).json(results);
          }
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  };

  const saveWaste = async (req, res) => {
    try {
        const { barcodeNumber, addToInventory} = req.body;

        if (barcodeNumber) {
          // Find the count of inventory records with the given barcodeNumber
          const inventoryCount = await Inventory.countDocuments({ barcodeNumber });
      
          // If there's only one inventory record with the given barcodeNumber, delete the product
          if (inventoryCount === 1) {
              await Product.findOneAndDelete({ barcodeNumber });
          }
      }

        // Delete inventory by inventory_id or barcodeNumber
        if (barcodeNumber && addToInventory) {
          await Inventory.findOneAndDelete({ barcodeNumber, addToInventory: addToInventory });
      } 

        // Save waste data
        const waste = new Waste(req.body);
        const result = await waste.save();

        const urlStr = `/api/v1/waste/${result.id}`;
        // Set content-location header
        res.set("content-location", urlStr);
        res.status(201).json({
            url: urlStr,
            data: result,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};
  
// const saveWaste = (req, res) => {
//     let waste = new Waste(req.body);
//     waste
//       .save()
//       .then((result) => {
//         const urlStr = `/api/v1/waste/${result.id}`;
//         // Set content-location header
//         res.set("content-location", urlStr);
//         res.status(201).json({
//           url: urlStr,
//           data: result,
//         });
//       })
//       .catch((error) => {
//         res.status(500).json(error);
//       });
//   };

  module.exports = { getWaste , saveWaste };