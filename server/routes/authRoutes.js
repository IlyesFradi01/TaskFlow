const router = require("express").Router();

const {
    registerUser,
    loginUser,
    getMe
} = require("../controllers/authController");

const protect = require("../middleware/protect");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

module.exports = router;