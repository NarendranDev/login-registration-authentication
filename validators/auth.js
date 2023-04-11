const { check, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const nameValidate ={validate: /^[A-Za-z\s]+$/,message:"In name no number, special characters are allowded"}
const passwordValidate={validate:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,message:"set password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"}
const mobileValidate={validate:/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,message:"invalid phone number "}
const validateSignUpRequest = [

check("username").notEmpty().withMessage("userName is required").matches(nameValidate.validate).withMessage(nameValidate.message),
check("email").isEmail().withMessage("Valid Email required"),
check("password").matches(passwordValidate.validate).withMessage(passwordValidate.message),
check("mobilephone").matches(mobileValidate.validate).withMessage(mobileValidate.message)

];
const validateSignIpRequest = [

check("email").isEmail().withMessage("Valid Email required"),
check("password").isLength({ min: 6 }).withMessage("Password required"),

]
const isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
      return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: errors.array()[0].msg });
  }
  next();
};
module.exports = {
  validateSignUpRequest,
  isRequestValidated,
  validateSignIpRequest,
}