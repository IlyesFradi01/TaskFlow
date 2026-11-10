const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Route principale
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to TaskFlow API"
    });
});
app.use("/api/auth", authRoutes);
const protect = require("./middleware/protect");

app.get("/api/auth/me", protect, (req, res) => {
    res.status(200).json({
        user: req.user
    });
});

// Démarrage du serveur
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5050;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();