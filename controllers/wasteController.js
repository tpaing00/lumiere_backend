const Waste = require("../models/Waste");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const { parse } = require("date-fns");

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
      await Waste.deleteOne({ _id: wasteId });
    } else {
      return res.status(400).json({ error: "Waste ID is required" });
    }
    res.status(200).json({ message: "Waste Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getWasteQuantityByCategory = (req, res) => {
  const { fromDate, toDate } = req.query;
  if (typeof fromDate == "undefined" && typeof toDate == "undefined") {
    Waste.aggregate([
      {
        $group: {
          _id: "$category",
          totalWasteQuantity: { $sum: "$wasteQuantity" },
        },
      },
    ])
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    // Parse dates from query parameters
    let fromDateObj = null;
    let toDateObj = new Date(); // Default to current date and time if toDate is not provided

    if (fromDate) {
      fromDateObj = parse(fromDate, "yyyy-MMM-dd", new Date());
    }

    if (toDate) {
      toDateObj = parse(toDate, "yyyy-MMM-dd", new Date());
    }

    // Check if fromDateObj is valid
    if (fromDateObj && isNaN(fromDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid fromDate" });
    }

    // Check if toDateObj is valid
    if (toDateObj && isNaN(toDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid toDate" });
    }

    // Check if there's any data available in the specified date range
    Waste.findOne({
      reportDate: {
        $gte: fromDateObj,
        $lte: toDateObj,
      },
    })
      .exec()
      .then((result) => {
        if (!result) {
          return res.status(404).json({
            message: "No records available for the specified date range.",
          });
        }

        Waste.aggregate([
          {
            $match: {
              reportDate: {
                $gte: fromDateObj,
                $lte: toDateObj,
              },
            },
          },
          {
            $group: {
              _id: "$category",
              totalWasteQuantity: { $sum: "$wasteQuantity" },
            },
          },
        ])
          .exec()
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};

const getTop5WasteByCategory = (req, res) => {
  const { fromDate, toDate } = req.query;
  if (typeof fromDate == "undefined" && typeof toDate == "undefined") {
    const pipeline = [
      // Group stage to group documents by category and calculate total wasteQuantity
      {
        $group: {
          _id: "$category",
          waste: { $push: "$$ROOT" },
          totalWasteQuantity: { $sum: "$wasteQuantity" },
        },
      },
      // Sort stage to sort categories by totalWasteQuantity in descending order
      {
        $sort: {
          totalWasteQuantity: -1,
        },
      },
      // Project stage to limit the fields to only the necessary ones and get top 5 waste entries
      {
        $project: {
          category: "$_id",
          totalWasteQuantity: 1,
          top5Waste: { $slice: ["$waste", 5] },
        },
      },
    ];

    // Execute aggregation pipeline
    Waste.aggregate(pipeline)
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    let fromDateObj = null;
    let toDateObj = new Date(); // Default to current date and time if toDate is not provided

    if (fromDate) {
      fromDateObj = parse(fromDate, "yyyy-MMM-dd", new Date());
    }

    if (toDate) {
      toDateObj = parse(toDate, "yyyy-MMM-dd", new Date());
    }

    // Check if fromDateObj is valid
    if (fromDateObj && isNaN(fromDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid fromDate" });
    }

    // Check if toDateObj is valid
    if (toDateObj && isNaN(toDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid toDate" });
    }

    // Define aggregation pipeline stages
    const pipeline = [];

    // Match stage to filter documents within the specified date range
    pipeline.push({
      $match: {
        reportDate: {
          $gte: fromDateObj,
          $lte: toDateObj,
        },
      },
    });

    // Group stage to group documents by category and calculate total wasteQuantity
    pipeline.push({
      $group: {
        _id: "$category",
        waste: { $push: "$$ROOT" },
        totalWasteQuantity: { $sum: "$wasteQuantity" },
      },
    });

    // Sort stage to sort categories by totalWasteQuantity in descending order
    pipeline.push({
      $sort: {
        totalWasteQuantity: -1,
      },
    });

    // Project stage to limit the fields to only the necessary ones
    pipeline.push({
      $project: {
        category: "$_id",
        totalWasteQuantity: 1,
        top5Waste: { $slice: ["$waste", 5] },
      },
    });

    // Execute aggregation pipeline
    Waste.aggregate(pipeline)
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};

module.exports = {
  getWaste,
  saveWaste,
  deleteWaste,
  getWasteQuantityByCategory,
  getTop5WasteByCategory,
};
