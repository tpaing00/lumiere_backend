const express = require('express');
const router = express.Router({mergeParams:true});

const userCtrl= require('../controllers/userController');

router.get("/user", userCtrl.getUser);
router.get("/user/:id", userCtrl.getUser);

module.exports = router;