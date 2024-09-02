const express = require("express");
const router = express.Router();
const authController = require("../controllers/authentication.controller.js");
const verifyToken = require("./protected.routes");


router.post("/login", authController.loginUser);
router.get('/me', verifyToken, authController.getLoggedInUser);

module.exports = router;