const express = require('express');
const router = express.Router({mergeParams:true});

const checkoutCtrl = require('../controllers/checkoutController');

router.post('/checkout', checkoutCtrl.checkoutProduct);

module.exports = router;