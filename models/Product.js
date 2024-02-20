const mongoose = require('mongoose')
const {Schema} = mongoose

const ProductSchema = new Schema({
  inventoryId: { type: String, required: true, maxLength: 30 },
  productId: { type: String, required: true, maxLength: 30 , default:"sampleProductId"},
  barcodeId: { type: String, required: true, maxLength: 30 },
  title: { type: String },
  brandName: { type: String },
  unitCost: { type: Number },
  unitPrice: { type: Number, required: true },
  category: { type: String, required: true },
  photo: { type: String, required: true },
  shelfLife: { type: Number, required: true }
});

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product