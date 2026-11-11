const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/user");

const getDashboardStats = async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";

        const projectQuery = isAdmin ? {} : { owner: req.user._id };
        const projects = await Project.find(projectQuery)
            .select("_id status owner")
            .populate("owner", "name email role");

        const projectIds = projects.map((project) => project._id);
        const tasks = await Task.find({
            project: { $in: projectIds }
        }).select("status priority dueDate project");

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

        if (isAdmin) {
            const allUsers = await User.find().select("_id name email role");
            const userSummaries = await Promise.all(allUsers.map(async (user) => {
                const userProjects = await Project.find({ owner: user._id }).select("_id");
                const userProjectIds = userProjects.map((project) => project._id);
                const userTasks = await Task.find({ project: { $in: userProjectIds } }).countDocuments();

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || "user",
                    projectCount: userProjects.length,
                    taskCount: userTasks
                };
            }));

            stats.totalUsers = allUsers.length;
            stats.adminUsers = allUsers.filter((user) => user.role === "admin").length;
            stats.users = userSummaries;
        }

        return res.status(200).json({ stats });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to load dashboard statistics"
        });
    }
};

module.exports = { getDashboardStats };