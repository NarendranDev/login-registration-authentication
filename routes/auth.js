const express = require("express");
const router = express.Router();
const { signUp, signIn, authMiddleware, logout } = require("../controller/auth");
const {
  isRequestValidated,
  validateSignUpRequest,
  validateSignIpRequest,
} = require("../validators/auth");
router.route("/signup").post(validateSignUpRequest, isRequestValidated, signUp);
router.route("/signin").post(validateSignIpRequest, isRequestValidated, signIn);
router.route("/profile").get(authMiddleware,(req,res)=>{
res.send(req.cookies.user)
})
router.route("/logout").post(logout);
module.exports = router;