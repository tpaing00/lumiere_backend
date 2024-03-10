const Waste = require("../models/Waste");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

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
    Waste.findOne({ _id: id })
      .exec()
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
    const { barcodeNumber, addToInventory } = req.body;

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
      await Inventory.findOneAndDelete({
        barcodeNumber,
        addToInventory: addToInventory,
      });
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

const deleteWaste = async (req, res) => {
  try {    
    const { wasteId } = req.body;
    if (!wasteId) {
      return res
        .status(400)
        .json({ error: "Barcode number and category are required" });
    }

    if (wasteId !== "") {
      await Waste.deleteOne({  _id: wasteId });
    }else {
      return res
      .status(400)
      .json({ error: "Waste ID is required" });
    }
    res.status(200).json({ message: "Waste Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getWaste, saveWaste, deleteWaste };
