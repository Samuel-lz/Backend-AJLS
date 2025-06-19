const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./database/database");
const UserDAO = require("./dao/UserDAO");

// Connect to database
connectDB();

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middlewares
app.use(express.json()); // Parse JSON requests
app.use(cors({           // Enable CORS with configuration
  origin: true,          // Allow all origins (restrict in production)
  credentials: true      // Allow credentials (cookies, authorization headers)
}));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Instantiate UserDAO
const userDAO = new UserDAO();

// Routes for User
app.get("/api/v1/users/", (req, res) => userDAO.getAll(req, res));  
app.post("/api/v1/users/", (req, res) => userDAO.create(req, res));
app.get("/api/v1/users/:id", (req, res) => userDAO.getById(req, res));
app.put("/api/v1/users/:id", (req, res) => userDAO.update(req, res));
app.delete("/api/v1/users/:id", (req, res) => userDAO.delete(req, res));

// Configure port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

