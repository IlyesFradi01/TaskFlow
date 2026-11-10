const router = require("express").Router();

const {
    getPublicProjects,
    getPublicProjectById
} = require("../controllers/publicController");

router.get("/projects", getPublicProjects);

router.get("/projects/:id", getPublicProjectById);

module.exports = router;