const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WasteSchema = new Schema({
    userId:{type: String, required:true, maxLength: 30, default:"sampleUserId"},
    inventoryId: { type: Object, required: true, maxLength: 30 },
    barcodeNumber:{type: String, required:true, maxLength: 30},
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    category: { type: String, required: true , enum: ["Hair Care", "Skin Care", "Body Care", "Make Up"]},
    photo: { type: Array, required: true },
    periodAfterOpening: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    dateAdded:{type : Date, default: Date.now },
    addToInventory:{type: String, enum: ["Internal Use", "Retail"]},
    expiryDate: {type : Date, required:true},
    wasteQuantity:{type: Number, default:0},
    reportDate:{type : Date, default: Date.now },
    message: { type: String }
});

const Waste = mongoose.model('Waste', WasteSchema);

module.exports = Waste;