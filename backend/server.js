const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();
const { connectDB } = require("./config/db");

const app = express();

/* ================= CORS (RENDER ONLY) ================= */
app.use(
  cors({
    origin: "https://estate-frontend-62p7.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight
app.options("*", cors());
/* ===================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/brokers", require("./routes/brokers"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve frontend if bundled
app.use(express.static(path.join(__dirname, "public")));

// React fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB();
});
