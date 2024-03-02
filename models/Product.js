const mongoose = require('mongoose')
const {Schema} = mongoose

const ProductSchema = new Schema({
  barcodeNumber: { type: String, required: true, maxLength: 30 },
  productName: { type: String, required: true },
  brandName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  category: { type: String, required: true , enum: ["Hair Care", "Skin Care", "Body Care", "Make Up"]},
  photo: { type: Array, required: true },
  periodAfterOpening: { type: Number, required: true }
});

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product