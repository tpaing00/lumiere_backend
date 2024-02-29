const mongoose = require('mongoose')
const {Schema} = mongoose

const NotificationSchema = new Schema({
  stockKeepingUnit: { type: Number, required: true, maxLength: 30 , default:5577},
  inventoryId: { type: String, required: true, maxLength: 30 },
  message: { type: String, default: "default message" },
  // dayInAdvance: { type: Number },
  lowStockQuantity: { type: Number, default:5},
  // notificationStartDate: { type: Date, required: true },
  // notificationEndDate: { type: Date, required: true },
  // activeStatus: { type: Boolean, required: true },
  isLowStockAlert: { type: Boolean, required: true },
  lowStockThreshold: { type: Number, required: true, default: 0 },
  isExpirationReminder: { type: Boolean, required: true },
  expirationReminderTime: { type: Number, required: true, default: 0 }
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification