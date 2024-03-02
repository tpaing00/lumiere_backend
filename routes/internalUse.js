const express = require('express');
const router = express.Router({mergeParams:true});

const internalUseCtrl = require('../controllers/internalUseController');

router.get('/internalUseList/:id', internalUseCtrl.getInternalUseList);

module.exports = router;