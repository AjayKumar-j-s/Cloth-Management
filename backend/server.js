import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
import dotenv from "dotenv";
import clientRoutes from "./routes/clientRoutes.js";
import { checkUnpaidClients } from "./services/paymentNotificationService.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/clientdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Schedule payment notification check (runs at 9 AM every day)
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily payment check...');
  await checkUnpaidClients();
});

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Use /api/clients for data.");
});

app.use("/api/clients", clientRoutes);

// Test routes
app.use("/api/test", testRoutes);

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
