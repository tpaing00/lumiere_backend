const Notification = require('../models/Notification');
const Inventory = require("../models/Inventory");

const getNotification = async(req, res) => {
    const id = req.params.id;
  
    try {
      if(typeof(id) == 'undefined') {
          let results = await Notification.find({}).exec();
          if(results !== null) {
              res.status(200).json(results);
          }
      } else {
        let results = await Notification.find({inventoryId: id}).exec();
        if(results !== null) {
            res.status(200).json(results);
        }
      }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


const getActiveNotificationList = async(req, res) => {
    try {
        let lowStockResults = await Inventory.aggregate([
            {
                $lookup: {
                  from: "notifications",
                  localField: "_id",
                  foreignField: "inventoryId",
                  as: "notificationResults"
                }
            },
            {
                $match: {
                    $and: [
                        { "notificationResults.isLowStockAlert": true },
                        {
                            $expr: {
                                $gt: [
                                    { $arrayElemAt: ["$notificationResults.lowStockThreshold", 0] },
                                     "$stockQuantity"
                                ]
                            }
                        }
                    ]  
                }
            }
          ])

          let expiryResults = await Inventory.aggregate([
            {
                $lookup: {
                  from: "notifications",
                  localField: "_id",
                  foreignField: "inventoryId",
                  as: "notificationResults"
                }
            },
            {
                $match: {
                    $and: [
                        { "notificationResults.isExpirationReminder": true },
                        {
                            $expr: {
                                $and: [
                                    {
                                        $gte: [
                                            new Date(),
                                            {
                                                $dateSubtract: {
                                                    startDate: "$expiryDate",
                                                    unit: "day",
                                                    amount: {
                                                        $convert: {
                                                            input: { $arrayElemAt: ["$notificationResults.expirationReminderTime", 0] },
                                                            to: "int"
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    { $lte: [new Date(), "$expiryDate"] }
                                ]
                            }
                        }
                    ]
                }

            }
          ])

        //   let internalUseExpiryResults = await Inventory.aggregate([
        //     {
        //         $lookup: {
        //           from: "notifications",
        //           localField: "_id",
        //           foreignField: "inventoryId",
        //           as: "notificationResults"
        //         }
        //     },
        //     {
        //         $match: {
        //             $and: [
        //                 { "notificationResults.isExpirationReminder": true },
        //                 {
        //                     $expr: {
        //                         $gt: [
        //                             { $arrayElemAt: ["$notificationResults.lowStockThreshold", 0] },
        //                              "$stockQuantity"
        //                         ]
        //                     }
        //                 }
        //             ]  
        //         }
        //     }
        //   ])

          if(lowStockResults !== null || expiryResults !== null ) {
            res.status(200).json({lowStockResultsLength : lowStockResults.length, lowStockResults, expiryResults });
        }
      } catch(error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
      }
}

module.exports = { getNotification, getActiveNotificationList }