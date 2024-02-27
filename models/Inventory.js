const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    userId:{type: String, required:true, maxLength: 30, default:"sampleUserId"},
    barcodeId:{type: String, required:true, maxLength: 30, default:"sampleBarcodeId"},
    stockQuantity:{type: Number, default:0},
    dateAdded:{type : Date, default: Date.now },
    addToInventory:{type: String, maxLength: 30},
    expiryDate: {type : Date, required:true}
});

const Inventory = mongoose.model('Inventory', InventorySchema);

module.exports = Inventory;
