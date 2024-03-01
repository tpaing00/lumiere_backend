const mongoose = require('mongoose')
const {Schema} = mongoose

const SaleSchema = new Schema({
    inventoryId: { type: String, required: true, maxLength: 30 },
    userId: {type: String, required:true, maxLength: 30, default:"sampleUserId" },
    soldQuantity: {type : Date, required:true },
    soldDate: {type : Date, required:true },
    reason: { type: String }
});

const Sale = mongoose.model('Sale', SaleSchema)

module.exports = Sale