const express=require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword } = require('../controllers/userController.js');

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logout);
router.post("/password/forgot",forgotPassword)
router.put("/password/reset/:token",resetPassword)


module.exports=router;