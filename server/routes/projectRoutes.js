
const express = require("express");
const router = express.Router();

const protect = require("../middleware/protect");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

// All project routes require authentication.
router.use(protect);

router.route("/")
    .post(createProject)
    .get(getProjects);

router.route("/:id")
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
