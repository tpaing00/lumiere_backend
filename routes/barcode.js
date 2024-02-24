const express = require('express');
const router = express.Router({mergeParams:true});

const barcodeCtrl= require('../controllers/barcodeController');

router.get("/barcode/:id", barcodeCtrl.getProductsByBarcode);

module.exports = router;