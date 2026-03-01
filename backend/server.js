if (!globalThis.PORT) {
  globalThis.PORT = process.env.PORT || 5000;
}

app.listen(globalThis.PORT, () => {
  console.log(`Server running on port ${globalThis.PORT}`);
});

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");

const app = express();

app.use(
  cors({
    origin: "*", // For the demo, this allows any frontend to connect
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure upload directory exists
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", claimRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
