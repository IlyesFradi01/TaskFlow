
const mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { title, description, category, status } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Project title is required"
            });
        }

        const project = await Project.create({
            title: title.trim(),
            description: description || "",
            category: category || "General",
            status: status || "Active",
            owner: req.user._id
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};


// @desc    Get all projects belonging to the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user._id
        })
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: projects.length,
            projects
        });

    } catch (error) {
        console.error("Get projects error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// @desc    Get one project and its tasks
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findOne({
            _id: id,
            owner: req.user._id
        }).populate("owner", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Retrieve tasks belonging to this project.
        // populate() retrieves the referenced project information.
        const tasks = await Task.find({
            project: project._id
        })
            .populate("project", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({
            project,
            tasks
        });

    } catch (error) {
        console.error("Get project error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Only allow these fields to be updated.
        const allowedFields = [
            "title",
            "description",
            "category",
            "status"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                project[field] = req.body[field];
            }
        }

        if (!project.title || !project.title.trim()) {
            return res.status(400).json({
                message: "Project title cannot be empty"
            });
        }

        project.title = project.title.trim();

        const updatedProject = await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject
        });

    } catch (error) {
        console.error("Update project error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};


// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Remove associated tasks to avoid orphan records.
        await Task.deleteMany({
            project: project._id
        });

        await project.deleteOne();

        res.status(200).json({
            message: "Project and associated tasks deleted successfully"
        });

    } catch (error) {
        console.error("Delete project error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};
