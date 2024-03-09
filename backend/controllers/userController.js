const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");

const User = require("../model/userModel");
const nodemailer = require("nodemailer");
const ResetToken = require("../model/ResetToken");
const uploadToCloudinary = require("../config/cloudinaryConnection");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // required for TLS
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD, // app password generated from Gmail settings
  },
});

// @desc Register a user
// @route GET /api/users/register
// @access public
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  let localFilePath = "";
  if (req.files?.image) {
    localFilePath = req.files.image[0].path;
    console.log(localFilePath);
  }

  try {
    // check for userName or password or email if not given throw error
    if (!userName || !password || !email) {
      return res.status(404).json({ message: "All fields are mandatory" });
    }

    let result = "";
    if (localFilePath) {
      result = await uploadToCloudinary(localFilePath);
      console.log(result);
    }

    // check is user exist with the given email
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered with the given email");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      profilePic: result ? result.url : "",
    });

    if (user) {
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Registration successful message",
        html: `<h3>Congratulation's your registration is successful. Your userId is ${user.id}`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      res.status(400).json({ message: "User data not valid" });
    }

    return res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }

  return res.status(200).json({ message: "Successful" });
};

// @desc Login  user
// @route GET /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // check for email and password is present or not, if not present throw new error
    if (!email || !password) {
      res.status(400);
      res.status(404).json({ message: "All fields are mandatory" });
    }

    // find user with the email id
    const user = await User.findOne({ email });
    console.log(user);

    // compare password with hashed password and generate the jwt token and send in the response
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            userName: user.userName,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "100m" }
      );

      res.status(200).json({
        accessToken,
        id: user._id,
      });
    } else {
      res.status(401).json({ message: "Email or password is not valid" });
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// @desc Current user info
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Forgot password
// @route GET /api/users/forgotPassword
// @access private
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    // find the user from database using email
    const user = await User.findOne({ email });

    // if user not found return user not found error
    if (!user) {
      res.status(401).json({ message: "User not found" });
    }

    // generate a token to be sent along with the email
    const forgetPasswordToken = crypto.randomBytes(20).toString("hex");

    // store the forgetPasswordToken in the database
    const resetToken = new ResetToken({
      user: user._id,
      token: forgetPasswordToken,
    });
    await resetToken.save();

    // send email to user with password reset link along with forgetPasswordToken and id
    const mailOptions = {
      from: "krabhisingh008@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `Reset password token=${forgetPasswordToken}`,
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Check your email to reset password" });
  } catch (err) {
    console.log(err.message);
  }
});

// @desc Reset password
// @route GET /api/users/resetPassword
// @access private
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token, email } = req.body;

  console.log(req.body);

  try {
    // return error if token or id is not present in req
    if (!token || !email) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // find user
    const user = await User.findOne({ email });

    // return error if user not present
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // get reset token from the database for the user
    const resetToken = await ResetToken.findOne({ user: user._id });

    // return error if reset token not found
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token not found" });
    }

    // match both the tokens , token from the req and the token from the database
    const isMatch = await bcrypt.compareSync(token, resetToken.token);

    // return error if token does not matches
    if (!isMatch) {
      return res.status(400).json({ message: "Token is not valid" });
    }

    // encrypt the new password and update the user's password in the database
    const newPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      password: newPassword,
    });
    console.log("Updated user = ", updatedUser);

    // remove reset token from the database after successfully changing password
    await ResetToken.deleteOne({ user: user._id });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err.message, "hello");
    return res.status(400).json({ message: err.message });
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
};
