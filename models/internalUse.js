const mongoose = require('mongoose')
const {Schema} = mongoose

const InternalUseSchema = new Schema({
    stockKeepingUnit: { type: String, required: true, default:"sampleStockKeepingUnit" },
    inventoryId: { type: String, required: true, maxLength: 30 },
    userId: {type: String, required:true, maxLength: 30, default:"sampleUserId" },
    openingDate: {type : Date, required:true },
    reminderDate: {type : Date, required:true },
    useByDate: {type : Date, required:true },
    quantity: {type: Number, default:0 },
    reason: { type: String }
});

const InternalUse = mongoose.model('InternalUse', InternalUseSchema)

module.exports = InternalUse