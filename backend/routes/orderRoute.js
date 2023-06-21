const express=require('express');
const { isAuthenciatedUser, authorizeRoles } = require('../middleware/auth.js');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController.js');

const router=express.Router();
router.post("/order/new",isAuthenciatedUser,newOrder);
router.get("/order/:id",isAuthenciatedUser,getSingleOrder);
router.get("/orders/me",isAuthenciatedUser,myOrders);
router.get("/admin/orders",isAuthenciatedUser,authorizeRoles("admin"),getAllOrders);
router.put("/admin/order/:id",isAuthenciatedUser,authorizeRoles("admin"),updateOrder);
router.delete("/admin/order/:id",isAuthenciatedUser,authorizeRoles("admin"),deleteOrder);

module.exports=router;