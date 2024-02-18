Inventory = require("../models/Inventory");

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
        Inventory.findOne({ _id: id }).exec()
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

  module.exports = { getInventory , saveInventory };