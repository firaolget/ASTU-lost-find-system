const router = require('express').Router();
const {report, getAllItems} = require('../controllers/itemController');



router.post("/api/items/report", report);

router.get("/api/items", getAllItems);

module.exports = router;