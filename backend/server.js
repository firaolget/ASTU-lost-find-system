const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));



if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, "ASTU-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


app.use(authRoutes);
app.use(itemsRoutes);
app.use(claimRoutes);




app.listen(5000, () => console.log("🚀 ASTU Backend Running on 5000"));
