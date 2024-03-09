const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const upload = require("../middleware/multerMiddleware");

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// router.post("/register", registerUser);
router.post(
  "/register",
  upload.fields([{ name: "image", maxCount: 1 }]),
  registerUser
);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.get("/current", validateToken, currentUser);

module.exports = router;
