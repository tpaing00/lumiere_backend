const express = require('express');
const router = express.Router({mergeParams:true});

const saleCtrl= require('../controllers/saleController');

router.get("/sale", saleCtrl.getSale);
router.get("/sale/:id", saleCtrl.getSale);
router.get("/totalsale", saleCtrl.getTotalSale);
router.get("/soldbycategory", saleCtrl.getsoldQuantityByCategory)
router.get("/topbyproductname", saleCtrl.getTopSoldQuantitiesByProductName)

module.exports = router;