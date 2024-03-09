const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User is required"],
  },
  email: {
    type: String,
    required: [true, "Please add the email address"],
    unique: [true, "Email address already taken"],
    validator: [validator.isEmail, "Enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePic: {
    type: String,
    // required: false,
  },
});

module.exports = mongoose.model("user", userSchema);
