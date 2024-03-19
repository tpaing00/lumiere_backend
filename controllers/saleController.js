const Sale = require("../models/Sale");
const { parse } = require("date-fns");


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
    Sale.find({ inventoryId: id })
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
  const { fromDate, toDate } = req.query;
  if (typeof fromDate == "undefined" && typeof toDate == "undefined") {
    Sale.aggregate([
      {
        $group: {
          _id: "$productName",
          Sale: { $push: "$$ROOT" },
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
    Sale.findOne({
      soldDate: {
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

        Sale.aggregate([
          {
            $match: {
              soldDate: {
                $gte: fromDateObj,
                $lte: toDateObj,
              },
            },
          },
          {
            $group: {
              _id: "$productName",
              Sale: { $push: "$$ROOT" },
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
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
  
};

module.exports = {
  getTotalSale,
  getSale,
  getsoldQuantityByCategory,
  getTopSoldQuantitiesByProductName,
};
