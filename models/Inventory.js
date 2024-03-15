const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    userId:{type: String, required:true, maxLength: 30, default:"sampleUserId"},
    barcodeNumber:{type: String, required:true, maxLength: 30},
    stockQuantity:{type: Number, default:0, set: setInitialStock},
    initialStock: { type: Number},
    totalValue: { type: Number, required: true },
    dateAdded:{type : Date, default: Date.now },
    addToInventory:{type: String, enum: ["Internal Use", "Retail"]},
    expiryDate: {type : Date, required:true}
});

// Define setter
function setInitialStock(stock) {
        this.initialStock = stock;
    return stock;
}

const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;
