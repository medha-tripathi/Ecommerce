const express=require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController.js');
const { isAuthenciatedUser, authorizeRoles } = require('../middleware/auth.js');

const router=express.Router();

router.get("/products",isAuthenciatedUser,getAllProducts);
router.get("/products/:id",getProductDetails);
router.post("/products/new",isAuthenciatedUser,authorizeRoles("admin"),createProduct);
router.put("/products/:id",isAuthenciatedUser,authorizeRoles("admin"),updateProduct);
router.delete("/products/:id",isAuthenciatedUser,authorizeRoles("admin"),deleteProduct);

module.exports=router;