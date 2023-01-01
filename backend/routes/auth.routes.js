const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const authenticateUser = require("../middlewares/authenticateUser");
const validateLogin = require("../middlewares/validateLogin");

router.post("/signup", authCtrl.signup);
router.post("/login", validateLogin, authCtrl.login);

// verify signup
router.put("/signup/verify/:userId", authCtrl.verifySignup);

router.post("/resendmail/:userId", authCtrl.resendMail);

module.exports = router;
