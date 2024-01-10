const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/Users", userController.getAllUsers);
router.get("/Users/session", auth, userController.session);
router.get("/User/:Id", userController.getUserById);
router.get("/User/Email/:Email", userController.getUserByEmail);
router.post("/User/create", userController.register);
router.post("/User/login", userController.login);
router.post("/User/logout", userController.logout);
router.post("/User/resetPassword", userController.resetPassword);
router.post("/User/verifyResetCode", userController.verifyResetCode);
router.post(
  "/User/updatePasswordWithCode",
  userController.updatePasswordWithCode
);
router.post("/User/credentials", userController.credentials);


router.put("/User/update/:Id", auth, userController.updateUserProfile);
router.put("/User/update/activate/:Id", userController.updateUserActivation);
//eunewoo work start
router.delete("/User/delete/:Id", userController.deleteUser);

module.exports = router;
