const router = require("express").Router();

const protect = require("../middleware/protect");

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

router.use(protect);

router.route("/")
    .get(getProjects)
    .post(createProject);

router.route("/:id")
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;