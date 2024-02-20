const express = require('express');
const router = express.Router({mergeParams:true});


const inventoryRouter = require('./inventory');
const authRouter = require('./auth');
const productRouter = require('./product');

router.use(inventoryRouter);
router.use(authRouter);
router.use(productRouter);


module.exports = router;