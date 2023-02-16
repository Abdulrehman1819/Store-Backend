const express=require("express");
const { newOrder, getSingleOrder, myOrder, getAllOrders,updateOrder,deleteOrder } = require("../controllers/orderController");
const { isAuthenticated,authorizedRoles } = require("../middleware/Auth");
const router=express.Router();

router.route("/order/new").post(isAuthenticated,newOrder);


router.route("/orders/me").get(isAuthenticated, myOrder);
router.route("/order/:id").get(isAuthenticated,getSingleOrder);
router.route("/orders").get(isAuthenticated,authorizedRoles("admin"),getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateOrder)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteOrder);
module.exports=router;