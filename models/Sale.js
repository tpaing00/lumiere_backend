const mongoose = require('mongoose')
const {Schema} = mongoose

const SaleSchema = new Schema({
    inventoryId: { type: Object, required: true, maxLength: 30 },
    userId: {type: String, required:true, maxLength: 30, default:"sampleUserId" },
    soldQuantity: {type : Number, required:true },
    soldDate: {type : Date, required:true, default: Date.now},
    reason: { type: String }
});

const Sale = mongoose.model('Sale', SaleSchema)

module.exports = Sale