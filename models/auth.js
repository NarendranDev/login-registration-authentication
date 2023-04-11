const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  username: {
     type: String,
     require: true,
     trim: true,
     unique: true,
     lowercase: true,
     index: true,
  },
  email: {
     type: String,
     require: true,
     trim: true,
     unique: true,
     lowercase: true,
  },
  hash_password: {
     type: String,
     require: true,
  },
  mobilephone: {
     type: String,
     require:true
  },
  rememberme:{
   type:Boolean,
   require:true,
  }
},{ timestamps: true });
userSchema.method({
  async authenticate(password) {
     return bcrypt.compare(password, this.hash_password);
  },
});
module.exports = mongoose.model("User", userSchema);