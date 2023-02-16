const { registerUser, login, logout, forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateRole, deleteUser } = require("../controllers/userController");

const express=require("express");
const { isAuthenticated, authorizedRoles } = require("../middleware/Auth");
const { getAllProducts } = require("../controllers/productcontroller");
const router=express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticated).get(getUserDetails)
router.route("/password/update").put(isAuthenticated,updatePassword)
router.route("/me/update").put(isAuthenticated,updateProfile    )
router.route("/admin/user").get(isAuthenticated,authorizedRoles("admin"),getAllUsers)
router.route("/admin/user/:id").get(isAuthenticated,authorizedRoles("admin"),getSingleUser).put(isAuthenticated,authorizedRoles("admin"),updateRole).delete(isAuthenticated,authorizedRoles("admin"),deleteUser)
module.exports=router;  