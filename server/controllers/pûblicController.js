const mongoose = require("mongoose");

const Project = require("../models/Project");
const Task = require("../models/Task");


// GET ALL PUBLIC PROJECTS
const getPublicProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            isPublic: true
        })
            .select("title description category status createdAt owner")
            .populate("owner", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: projects.length,
            projects
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to retrieve public projects"
        });
    }
};


// GET ONE PUBLIC PROJECT
const getPublicProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findOne({
            _id: id,
            isPublic: true
        })
            .select("title description category status createdAt owner")
            .populate("owner", "name");

        if (!project) {
            return res.status(404).json({
                message: "Public project not found"
            });
        }

        const tasks = await Task.find({
            project: project._id
        })
            .select("title description status priority dueDate createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            project,
            tasks
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to retrieve public project"
        });
    }
};


module.exports = {
    getPublicProjects,
    getPublicProjectById
};