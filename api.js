const express = require("express");
const mongoose = require("mongoose");
const TransactionActivity = require("./models/TransactionActivity");

require("dotenv").config();

const app = express();

// MongoDB connection URI (ensure it's set in your environment variables)
const mongodbUri = process.env.MONGODB_URL;
const PORT = process.env.API_PORT || 3000; // Use dynamic port or fallback to 3000
// Connect to MongoDB
mongoose
  .connect(mongodbUri)
  .then(() => console.log("Mongodb connection is established"))
  .catch((error) => {
    console.error("Error connecting to Mongodb:", error);
    process.exit(1);
  });

app.use(express.json());

app.get("/user-logs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const transactionLog = await TransactionActivity.findById(id);
    if (!transactionLog) {
      return res.status(404).json({ error: "log id not found" });
    }
    res.json({
      data: transactionLog,
    });
  } catch (error) {
    console.error("Error fetching transaction log by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/user-logs", async (req, res) => {
  try {
    console.log("Request received!");
    const { userId, action, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (userId) query.userId = userId;
    if (action) query.action = action;

    // Pagination (how many docs to skip)
    const skip = (page - 1) * limit;

    // Fetch logs
    const logs = await TransactionActivity.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Count total documents for pagination metadata
    const total = await TransactionActivity.countDocuments(query);

    res.json({
      data: logs,
      metadata: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API endpoint is running`);
});
