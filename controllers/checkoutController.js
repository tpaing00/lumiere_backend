const Inventory = require('../models/Inventory');
const InternalUse = require('../models/InternalUse');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');

const checkoutProduct = async (req, res) => {
    try {
        // Extract form data from JSON request body
        const {
            userId,
            addToInventory,
            category,
            productName,
            brandName,
            stockQuantity,
            barcodeNumber,
            unitPrice,
            photo,
            expiryDate,
            periodAfterOpening,
            isLowStockAlert,
            lowStockThreshold,
            isExpirationReminder,
            expirationReminderTime
        } = req.body;

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { checkoutProduct }