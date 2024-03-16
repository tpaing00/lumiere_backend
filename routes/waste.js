const express = require('express');
const router = express.Router({mergeParams:true});

const wasteCtrl= require('../controllers/wasteController');

router.get("/waste", wasteCtrl.getWaste);
router.get("/waste/:id", wasteCtrl.getWaste);
router.post("/waste", wasteCtrl.saveWaste);
router.delete('/wastedelete', wasteCtrl.deleteWaste);
router.get('/wastebycategory', wasteCtrl.getWasteQuantityByCategory);

router.get('/wastetop5bycategory', wasteCtrl.getTop5WasteByCategory);

module.exports = router;