const Inventory = require('../models/Inventory');
const InternalUse = require('../models/InternalUse');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');

const checkoutProduct = async (req, res) => {
    try {
        // Extract form data from JSON request body
        const {
            userId,
            inventoryId,
            addToInventory,
            quantity,
            reason,
            openingDate,
            useByDate,
            isExpirationReminder,
            reminderTime,
            checkoutDate,
            soldQuantity,
            soldDate    
        } = req.body;

        // Add the filter for update
        const filter = { _id: inventoryId };
        // Define the update operation
        let update = ""
        if(addToInventory == "Retail") {
            update = {
                $inc: {
                    stockQuantity: -soldQuantity 
                }
            };
        } else {
            update = {
                $inc: {
                    stockQuantity: -quantity 
                }
            };
        }
        const UpdatatedInventoryResults = await Inventory.updateOne(filter, update);
        console.log('Inventory updated successfully');
        console.log(UpdatatedInventoryResults);  
            
        // const updatedInventory = await Inventory.find({ _id: inventoryId });
        
        let saleResults = ""
        let internalUseResults = ""
        let notificationResults = ""
        if(addToInventory == "Retail") {
            // Create Sale object
            let sale = new Sale(
                {
                    inventoryId,
                    userId,
                    soldQuantity : parseInt(soldQuantity),
                    soldDate : new Date(soldDate),
                    reason
                }
            );
            saleResults = await sale.save();
        } else {
            if(addToInventory == "Internal Use") {
                // Create InternalUse object
                let internalUse = new InternalUse(
                    {
                        inventoryId,
                        userId,
                        openingDate :new Date(openingDate),
                        reminderTime :parseInt(reminderTime),
                        useByDate,
                        quantity : parseInt(quantity),
                        reason,
                        checkoutDate
                    }
                );
                internalUseResults = await internalUse.save();

                // Create Notification object
                let notification = new Notification(
                    {
                        stockKeepingUnit : internalUseResults._id,
                        isExpirationReminder: isExpirationReminder,
                        expirationReminderTime: parseInt(reminderTime)
                    }
                );
                notificationResults = await notification.save();
            }
        }    
        res.status(201).json({ UpdatatedInventoryResults, internalUseResults, notificationResults, saleResults });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { checkoutProduct }