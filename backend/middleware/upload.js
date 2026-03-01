const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, "ASTU-" + Date.now() + path.extname(file.originalname));
  },
});

module.exports = multer({ storage });
