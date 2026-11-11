const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/user");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const publicRoutes = require("./routes/publicRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();


// MIDDLEWARES
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));


// HOME ROUTE
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to TaskFlow API"
    });
});


// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/public", publicRoutes);


// ERROR HANDLING
app.use(notFound);

app.use(errorHandler);


const ensureDefaultAdmin = async () => {
    const email = (process.env.ADMIN_EMAIL || "admin@taskflow.local").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "Admin123456";

    let admin = await User.findOne({ email });

    if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 12);
        admin = await User.create({
            name: "System Admin",
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log(`Default admin created: ${email}`);
        return;
    }

    if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log(`Updated ${email} to admin role`);
    }
};

// START SERVER
const startServer = async () => {
    await connectDB();
    await ensureDefaultAdmin();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();