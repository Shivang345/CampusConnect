// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const eventRoutes = require("./routes/events");
const clubRoutes = require("./routes/clubs");
const uploadRoutes = require("./routes/uploads");

const errorHandler = require("./middleware/errorhandler");
const redisClient = require("./config/redis"); // 🔴 new

const app = express();

// 🔌 Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

// Basic Socket.IO connection logging
io.on("connection", (socket) => {
  console.log("WebSocket client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("WebSocket client disconnected:", socket.id);
  });
});

// Make io and redis available in routes via req.app.get('io') / req.app.get('redis')
app.set("io", io);
app.set("redis", redisClient); // 🔴 now routes can use Redis

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      // Allow cross-origin access
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/uploads", uploadRoutes);

// Basic health route
app.get("/", (req, res) => {
  res.send({ message: "CampusConnect API is running" });
});

// 404 handler for unknown routes (optional but good)
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

// CENTRALIZED ERROR HANDLER (must be last middleware)
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
