const Sale = require("../models/Sale");


const getSale = (req, res) => {
  const id = req.params.id;
  if (typeof id == "undefined") {
    Sale.find({})
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    Sale.find({ _id: id })
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

const getTotalSale = (req, res) => {
  Sale.aggregate([
    {
      $group: {
        _id: null,
        totalSale: { $sum: "$soldQuantity" },
      },
    },
  ])
    .exec()
    .then((result) => {
      res.status(200).json({ totalSale: result[0].totalSale });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

const getsoldQuantityByCategory = (req, res) => {
  Sale.aggregate([
    {
      $group: {
        _id: "$category",
        totalSoldQuantity: { $sum: "$soldQuantity" },
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
};

const getTopSoldQuantitiesByProductName = (req, res) => {
  Sale.aggregate([
    {
      $group: {
        _id: "$productName",
        totalSoldQuantity: { $sum: "$soldQuantity" },
      },
    },
    {
      $sort: { totalSoldQuantity: -1 },
    },
    {
      $limit: 5,
    },
  ])
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

module.exports = {
  getTotalSale,
  getSale,
  getsoldQuantityByCategory,
  getTopSoldQuantitiesByProductName,
};
