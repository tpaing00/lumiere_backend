const mongoose = require('mongoose')
const {Schema} = mongoose

const ProductSchema = new Schema({
  inventoryId: { type: String, required: true, maxLength: 30 },
  barcodeNumber: { type: String, required: true, maxLength: 30 },
  productName: { type: String, required: true },
  brandName: { type: String, required: true },
  totalValue: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  category: { type: String, required: true , enum: ["Hair Care", "Skin Care", "Body Care", "Make Up"]},
  photo: { type: String, required: true },
  periodAfterOpening: { type: Number, required: true }
});

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product