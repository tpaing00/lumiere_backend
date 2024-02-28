const express = require('express');
const router = express.Router({mergeParams:true});

const inventoryRouter = require('./inventory');
const authRouter = require('./auth');
const productRouter = require('./product');
const barcodeRouter = require('./barcode');
const notificationRouter = require('./notification');

router.use(inventoryRouter);
router.use(authRouter);
router.use(productRouter);
router.use(barcodeRouter);
router.use(notificationRouter);

module.exports = router;