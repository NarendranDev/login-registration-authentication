const { StatusCodes } = require("http-status-codes");
const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {phone} = require("phone")
const signUp = async (req, res) => {
  const { username, email, password ,mobilephone,rememberme} = req.body;
  if (!username|| !email || !password || !mobilephone || !rememberme) {
     return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please Provide Required Information",
     });
  }
 const hash_password = await bcrypt.hash(password, 10);
 
  const userData = {
     username,
     email,
     hash_password,
     mobilephone,
     rememberme
  };

if (phone(mobilephone).isValid === false){
   return res.status(StatusCodes.BAD_REQUEST).json({
      message: "invalid country code or phone number",
   });
}
const name=await User.findOne({username});
if(name){
   return res.status(StatusCodes.BAD_REQUEST).json({
      message: "user name already in use try another one ",
   });

}
  const user = await User.findOne({ email });
  if (user) {
     return res.status(StatusCodes.BAD_REQUEST).json({
        message: "E-mail already in use try another or login",
     });
  } else {
     User.create(userData).then((data, err) => {
     if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
     else
       res
        .status(StatusCodes.CREATED)
        .json({ message: "User created Successfully" });
     });
  }
};

const signIn = async (req, res) => {
  try {
     if (!req.body.email || !req.body.password || req.body.rememberme) {
        res.status(StatusCodes.BAD_REQUEST).json({
           message: "Please enter email and password",
        });
     }
     const user = await User.findOne({ email: req.body.email });
     if (user) {
         if (user.authenticate(req.body.password)) {
           const token = jwt.sign(
              { _id: user._id},
              process.env.JWT_SECRET,{ expiresIn: req.body.rememberme? "15m" : '1m'});
          const { _id, username,  email,mobilephone   } = user;
          res.cookie('token', token, { httpOnly: true })
          res.cookie('user',{name:user.username,email:user.email},{ httpOnly: true })
          res.status(StatusCodes.OK).json({token,user: { _id, username,  email ,mobilephone }});
 }
  else {
  res.status(StatusCodes.UNAUTHORIZED).json({
     message: "Something went wrong!",
  });
 }
} else {
  res.status(StatusCodes.BAD_REQUEST).json({
      message: "User does not exist..!",
  });
}
} catch (error) {
   console.log(error)
   res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
};

const authMiddleware = (req, res, next) => {
   const token = req.cookies.token;
   try {
      const user = {
token:jwt.verify(token,process.env.JWT_SECRET)}
     req.user = user;
     next();
   } catch (err) {
     res.sendStatus(401);
   }
 };
 const logout=(req,res,next)=>{
   res.clearCookie('token')
   res.clearCookie('user')
   res.send("logged out successfully")

 }
module.exports = { signUp, signIn,authMiddleware,logout};