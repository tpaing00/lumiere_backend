const Inventory = require("../models/Inventory");

const getInventory = (req, res) => {
  const id = req.params.id;
  if (typeof id == "undefined") {
    Inventory.find({})
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    Inventory.findOne({ _id: id })
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

const saveInventory = (req, res) => {
  let inventory = new Inventory(req.body);
  inventory
    .save()
    .then((result) => {
      const urlStr = `/api/v1/inventory/${result.id}`;
      // Set content-location header
      res.set("content-location", urlStr);
      res.status(201).json({
        url: urlStr,
        data: result,
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getTotalInventory = (req, res) => {
  Inventory.aggregate([
    {
      $group: {
        _id: null,
        totalInventory: { $sum: "$stockQuantity" },
      },
    },
  ])
    .exec()
    .then((result) => {
      res.status(200).json({ totalInventory: result[0].totalInventory });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getTotalInventoryValue = (req, res) => {
  Inventory.aggregate([
    {
      $group: {
        _id: null,
        totalInventoryValue: { $sum: "$totalValue" },
      },
    },
  ])
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ totalInventoryValue: result[0].totalInventoryValue });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

module.exports = {
  getInventory,
  saveInventory,
  getTotalInventory,
  getTotalInventoryValue,
};
