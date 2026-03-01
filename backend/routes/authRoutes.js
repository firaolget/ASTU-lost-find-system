router = require("express").Router();

const { register, login } = require("../controllers/authController");

router.post("/api/auth/register", register);

router.post("/api/auth/login", login);

module.exports = router;
