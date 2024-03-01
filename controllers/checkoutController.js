const Inventory = require('../models/Inventory');
const InternalUse = require('../models/internalUse');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');

const checkoutProduct = async (req, res) => {
    try {
        // Extract form data from JSON request body
        const {
            userId,
            inventoryId,
            barcodeNumber,
            category,
            quantity,
            reason,
            openingDate,
            useByDate,
            reminderTime,
            soldDate
        } = req.body;


        if(category == "Retail"){
            // Create Sale object
            let sale = new Sale(
                {
                    inventoryId,
                    userId,
                    soldQuantity : parseInt(quantity),
                    soldDate : new Date(soldDate),
                    reason
                }
            );
            const saleResults = await sale.save();
        } else {
            if(category == "Internal Use") {
                // Create InternalUse object
                let internalUse = new InternalUse(
                    {
                        inventoryId,
                        userId,
                        openingDate :new Date(openingDate),
                        reminderTime :parseInt(reminderTime),
                        useByDate,
                        quantity : parseInt(quantity),
                        reason
                    }
                );
                const internalUseResults = await internalUse.save();

                // Create Notification object
                let notification = new Notification(
                    {
                        stockKeepingUnit : internalUseResults._id,
                        isExpirationReminder: isExpirationReminder,
                        expirationReminderTime: parseInt(reminderTime)
                    }
                );
                const notificationResults = await notification.save();
            }
        }    

        res.status(201).json({ internalUseResults, notificationResults, saleResults });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { checkoutProduct }