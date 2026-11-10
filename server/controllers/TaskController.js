const mongoose = require("mongoose");

const Task = require("../models/Task");
const Project = require("../models/Project");

const validId = (id) => mongoose.isValidObjectId(id);

const findOwnedProject = (projectId, userId) => {
    return Project.findOne({
        _id: projectId,
        owner: userId
    });
};


// CREATE TASK
const createTask = async (req, res) => {
    try {
        const {
            title,
            description = "",
            status = "Todo",
            priority = "Medium",
            dueDate = null,
            project: projectId
        } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            !projectId
        ) {
            return res.status(400).json({
                message: "Task title and project are required"
            });
        }

        if (!validId(projectId)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await findOwnedProject(
            projectId,
            req.user._id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description,
            status,
            priority,
            dueDate: dueDate || null,
            project: project._id
        });

        await task.populate("project", "title");

        return res.status(201).json({
            message: "Task created",
            task
        });

    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Unable to create task"
        });
    }
};


// GET ALL USER TASKS
const getTasks = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user._id
        }).select("_id");

        const projectIds = projects.map((project) => project._id);

        const filter = {
            project: { $in: projectIds }
        };

        if (req.query.projectId) {
            if (!validId(req.query.projectId)) {
                return res.status(400).json({
                    message: "Invalid project ID"
                });
            }

            const ownsProject = projectIds.some(
                (id) => String(id) === req.query.projectId
            );

            if (!ownsProject) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            filter.project = req.query.projectId;
        }

        const tasks = await Task.find(filter)
            .populate("project", "title")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to retrieve tasks"
        });
    }
};


// GET ONE TASK
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(id)
            .populate("project", "title owner");

        if (
            !task ||
            !task.project ||
            String(task.project.owner) !== String(req.user._id)
        ) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({ task });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to retrieve task"
        });
    }
};


// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(id)
            .populate("project", "owner");

        if (
            !task ||
            !task.project ||
            String(task.project.owner) !== String(req.user._id)
        ) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "status",
            "priority",
            "dueDate"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                task[field] =
                    field === "dueDate" && req.body[field] === ""
                        ? null
                        : req.body[field];
            }
        }

        if (
            typeof task.title !== "string" ||
            !task.title.trim()
        ) {
            return res.status(400).json({
                message: "Task title cannot be empty"
            });
        }

        task.title = task.title.trim();

        await task.save();

        await task.populate("project", "title");

        return res.status(200).json({
            message: "Task updated",
            task
        });

    } catch (error) {
        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Unable to update task"
        });
    }
};


// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!validId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findById(id)
            .populate("project", "owner");

        if (
            !task ||
            !task.project ||
            String(task.project.owner) !== String(req.user._id)
        ) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        return res.status(200).json({
            message: "Task deleted"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to delete task"
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};