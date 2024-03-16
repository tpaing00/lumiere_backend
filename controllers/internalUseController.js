
const InternalUse = require("../models/InternalUse");

const getInternalUseList = async(req, res) => {
    const id = req.params.id;
    try {
        if (typeof id == "undefined") {
            return res.status(400).json({ error: 'Inventory ID is missing' });
        }
        const InternalUseListResults = await InternalUse.find({ inventoryId: id }).exec();
       
        res.status(200).json({InternalUseListResults});

    } catch(error) {
        return res.status(500).json(error.message);
    };
}

const getTotalInStore = (req, res) => {
    InternalUse.aggregate([
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


module.exports = {getInternalUseList, getTotalInStore};