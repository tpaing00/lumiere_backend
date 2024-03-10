const express = require('express');
const router = express.Router({mergeParams:true});

const wasteCtrl= require('../controllers/wasteController');

router.get("/waste", wasteCtrl.getWaste);
router.get("/waste/:id", wasteCtrl.getWaste);
router.post("/waste", wasteCtrl.saveWaste);
router.delete('/wastedelete', wasteCtrl.deleteWaste);

module.exports = router;