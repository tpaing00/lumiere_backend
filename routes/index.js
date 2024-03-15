const express = require('express');
const router = express.Router({mergeParams:true});

const inventoryRouter = require('./inventory');
const authRouter = require('./auth');
const productRouter = require('./product');
const barcodeRouter = require('./barcode');
const notificationRouter = require('./notification');
const checkoutRouter = require('./checkout');
const internalUseRouter = require('./internalUse');
const wasteRouter = require('./waste');
const userRouter = require('./user');
const saleRouter = require('./sale');

const authCtrl = require('../controllers/authController');

// Mount authRouter
router.use(authRouter);

//Middleware to verify token
router.use((req, res, next) => {
    authCtrl.verifyToken(req, res, next);
});

router.use(inventoryRouter);
router.use(productRouter);
router.use(barcodeRouter);
router.use(notificationRouter);
router.use(checkoutRouter);
router.use(internalUseRouter);
router.use(wasteRouter);
router.use(userRouter);
router.use(saleRouter);

module.exports = router;