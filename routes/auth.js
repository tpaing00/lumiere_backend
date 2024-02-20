const express = require('express');
const router = express.Router({mergeParams:true});

const authCtrl = require('../controllers/authController');

router.post("/signup", authCtrl.setSignUp);
// router.get("/login", authCtrl.getSignIn);

module.exports = router;