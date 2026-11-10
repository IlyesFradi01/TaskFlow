const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user._id
        }).select("_id status");

        const projectIds = projects.map(
            (project) => project._id
        );

        const tasks = await Task.find({
            project: { $in: projectIds }
        }).select("status priority dueDate");

        const now = new Date();

        const stats = {
            totalProjects: projects.length,

            activeProjects: projects.filter(
                (p) => p.status === "Active"
            ).length,

            completedProjects: projects.filter(
                (p) => p.status === "Completed"
            ).length,

            totalTasks: tasks.length,

            todoTasks: tasks.filter(
                (t) => t.status === "Todo"
            ).length,

            inProgressTasks: tasks.filter(
                (t) => t.status === "In Progress"
            ).length,

            completedTasks: tasks.filter(
                (t) => t.status === "Done"
            ).length,

            highPriorityTasks: tasks.filter(
                (t) => t.priority === "High" && t.status !== "Done"
            ).length,

            overdueTasks: tasks.filter(
                (t) =>
                    t.dueDate &&
                    t.dueDate < now &&
                    t.status !== "Done"
            ).length
        };

        return res.status(200).json({ stats });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to load dashboard statistics"
        });
    }
};

module.exports = { getDashboardStats };