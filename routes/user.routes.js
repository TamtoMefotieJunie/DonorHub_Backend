const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authcontroller = require("../controllers/authentication.controller")

router.post("/register", userController.registerUser);
router.post("/login", authcontroller.loginUser);
router.get("/email/:email",userController.getUserByEmail);
router.get("/:id",userController.getUserById);
router.get("/",userController.getAllUsers);
router.put("/update/:id",userController.updateUser);
router.delete("/delete/:id",userController.deleteUSer);
router.get("/getAll/Role/:role",userController.getUserByRole);


module.exports = router;
