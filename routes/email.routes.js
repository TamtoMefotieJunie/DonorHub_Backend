const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");

router.post("/contact-friend", emailController.contactFriend);

module.exports = router;