const mongoose = require('mongoose')
const {Schema} = mongoose

const ProductSchema = new Schema({
  inventoryId:{type: String, required:true, maxLength: 30},
  userId:{type: String, required:true, maxLength: 30},
  barcodeId:{type: String, required:true, maxLength: 30},
  stockQuantity:{type: Number, default:0},
  dateAdded:{type : Date, default: Date.now },
  inStore:{type: Boolean, default: false},
  expirationDate: {type : Date, required:true}
})

const Product = mongoose.model('Inventory', ProductSchema)

module.exports = Product