const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const { connectDB } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.send("Task Tracker API Running");
});

const BASE_PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();

  const tryListen = (port, attemptsLeft = 5) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is busy, trying ${nextPort} instead.`);
        server.close(() => tryListen(nextPort, attemptsLeft - 1));
        return;
      }

      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
  };

  tryListen(BASE_PORT);
};

startServer();