const mongoose = require('mongoose')
const {Schema} = mongoose

const SaleSchema = new Schema({
    inventoryId: { type: Object, required: true, maxLength: 30 },
    userId: {type: String, required:true, maxLength: 30, default:"sampleUserId" },
    soldQuantity: {type : Number, required:true },
    soldDate: {type : Date, required:true, default: Date.now},
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true , enum: ["Hair Care", "Skin Care", "Body Care", "Make Up"]},
    reason: { type: String }
});

const Sale = mongoose.model('Sale', SaleSchema)

module.exports = Sale