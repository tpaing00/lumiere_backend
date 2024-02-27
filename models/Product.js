const mongoose = require('mongoose')
const {Schema} = mongoose

const ProductSchema = new Schema({
  inventoryId: { type: String, required: true, maxLength: 30 },
  barcodeId: { type: String, required: true, maxLength: 30 },
  productName: { type: String },
  brandName: { type: String },
  unitCost: { type: Number },
  unitPrice: { type: Number, required: true },
  addToCategory: { type: String, required: true },
  photo: { type: String, required: true },
  periodAfterOpening: { type: Number, required: true }
});

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product