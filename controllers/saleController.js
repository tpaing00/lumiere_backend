const Sale = require("../models/Sale");
const InStore = require("../models/InternalUse")

const getSale = (req, res) => {
  Sale.find({})
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
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
      }
    ])
      .exec()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  };

  const getTotalInStore = (req, res) => {
    InStore.aggregate([
      {
        $group: {
          _id: null,
          totalSale: { $sum: "$quantity" },
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

module.exports = {
  getTotalSale,
  getSale,
  getsoldQuantityByCategory,
  getTopSoldQuantitiesByProductName,
  getTotalInStore
};
