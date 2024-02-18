const express = require('express');
const router = express.Router({mergeParams:true});


const inventoryRouter = require('./inventory');
const authRouter = require('./auth');

router.use(inventoryRouter);
router.use(authRouter);


module.exports = router;