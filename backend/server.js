const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/companies");
const meetingRoutes = require("./routes/meetings");
const taskRoutes = require("./routes/tasks");
const notificationRoutes = require("./routes/notifications");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Allow all origins in development or if CORS_ORIGIN is *
      if (process.env.CORS_ORIGIN === "*") return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.some((allowed) => origin?.includes(allowed))
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for now, can restrict later
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB connection and server start
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Use in-memory MongoDB if no URI provided or if it's localhost
    if (!mongoUri || mongoUri.includes("localhost")) {
      console.log("Starting in-memory MongoDB server...");
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log("In-memory MongoDB started at:", mongoUri);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");

    // Start server only after MongoDB connection is established
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`API available at: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
};

startServer();
