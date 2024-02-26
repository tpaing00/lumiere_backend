const express = require('express');
const router = express.Router({mergeParams:true});

const inventoryRouter = require('./inventory');
const authRouter = require('./auth');
const barcodeRouter = require('./barcode');

router.use(inventoryRouter);
router.use(authRouter);
router.use(barcodeRouter);

module.exports = router;