const router = require("express").Router();

const protect = require("../middleware/protect");
const requireAdmin = require("../middleware/admin");

const {
    getDashboardStats
} = require("../controllers/dashboardController");

router.get("/stats", protect, getDashboardStats);
router.get("/admin", protect, requireAdmin, getDashboardStats);

module.exports = router;