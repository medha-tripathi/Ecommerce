const express=require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUser, deleteUser } = require('../controllers/userController.js');
const { isAuthenciatedUser, authorizeRoles } = require('../middleware/auth.js');

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logout);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);
router.get("/me",isAuthenciatedUser,getUserDetails);
router.put("/password/update",isAuthenciatedUser,updatePassword);
router.put("/me/update",isAuthenciatedUser,updateProfile);
router.get("/admin/users",isAuthenciatedUser,authorizeRoles("admin"),getAllUser)
router.get("/admin/user/:id",isAuthenciatedUser,authorizeRoles("admin"),getSingleUser)
router.put("/admin/user/:id",isAuthenciatedUser,authorizeRoles("admin"),updateUser)
router.delete("/admin/user/:id",isAuthenciatedUser,authorizeRoles("admin"),deleteUser)

module.exports=router;