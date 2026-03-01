const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { reportItem, getItems } = require("../controllers/itemController");

router.post("/report", upload.single("image"), reportItem);
router.get("/", getItems);

module.exports = router;
