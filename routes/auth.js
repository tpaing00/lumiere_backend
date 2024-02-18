const express = require('express');
const router = express.Router({mergeParams:true});

const authCtrl = require('../controllers/authController');

// router.post("/signin", authCtrl.getSignIn);
// router.post("/signup", authCtrl.setSignUp);

module.exports = router;