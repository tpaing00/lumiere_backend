const express = require('express');
const router = express.Router({mergeParams:true});

const inventoryRouter = require('./inventory');
const authRouter = require('./auth');
const productRouter = require('./product');
const barcodeRouter = require('./barcode');

router.use(inventoryRouter);
router.use(authRouter);
router.use(productRouter);
router.use(barcodeRouter);

module.exports = router;