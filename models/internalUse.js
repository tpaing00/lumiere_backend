const mongoose = require('mongoose')
const {Schema} = mongoose

const InternalUseSchema = new Schema({
    inventoryId: { type: String, required: true, maxLength: 30 },
    userId: {type: String, required:true, maxLength: 30, default:"sampleUserId" },
    openingDate: {type : Date, required:true },
    reminderTime: { type: Number, required: true, default: 0 },
    useByDate: {type : Date, required:true },
    quantity: {type: Number, default:0 },
    reason: { type: String },
    checkoutDate: {type : Date, required:true, default: Date.now}
});

const InternalUse = mongoose.model('InternalUse', InternalUseSchema)

module.exports = InternalUse