const express=require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController.js');
const { isAuthenciatedUser, authorizeRoles } = require('../middleware/auth.js');

const router=express.Router();

router.get("/products",isAuthenciatedUser,getAllProducts);
router.get("/products/:id",getProductDetails);
router.post("/admin/products/new",isAuthenciatedUser,authorizeRoles("admin"),createProduct);
router.put("/admin/products/:id",isAuthenciatedUser,authorizeRoles("admin"),updateProduct);
router.delete("/admin/products/:id",isAuthenciatedUser,authorizeRoles("admin"),deleteProduct);
router.put("/review",isAuthenciatedUser,createProductReview)
router.get("/reviews",getProductReviews);
router.delete("/reviews",isAuthenciatedUser,deleteReview);

module.exports=router;