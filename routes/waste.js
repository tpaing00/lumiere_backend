const express = require('express');
const router = express.Router({mergeParams:true});

const wasteCtrl= require('../controllers/wasteController');

router.get("/waste", wasteCtrl.getWaste);
router.get("/waste/:id", wasteCtrl.getWaste);
router.post("/waste", wasteCtrl.saveWaste);

module.exports = router;