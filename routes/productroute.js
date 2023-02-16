const express=require("express");
const { getAllProducts, createProduct,updateProduct, deleteProduct, getProductDetails,createProductReview, getProductReviews, deleteReview } = require("../controllers/productcontroller");
const { isAuthenticated,authorizedRoles } = require("../middleware/Auth");
const router=express.Router();
router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticated,authorizedRoles("admin"),createProduct);
router.route('/admin/product/:id').put(isAuthenticated,authorizedRoles("admin"),updateProduct);
router.route('/product/:id').delete(isAuthenticated,authorizedRoles("admin"),deleteProduct)
router.route("/product/:id").get(getProductDetails)
// isAuthenticated get Product Details main say hataya hai

router.route("/review").put(isAuthenticated,createProductReview)
router.route("/reviews").get(getProductReviews).delete(isAuthenticated,deleteReview);
module.exports=router;  