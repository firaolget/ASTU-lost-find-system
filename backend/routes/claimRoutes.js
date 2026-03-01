const router = require("express").Router();
const {
  getAllClaims,
  submitClaim,
  processClaim,
} = require("../controllers/claimController");

router.post("/api/claims/submit", submitClaim);

router.get("/api/admin/claims", getAllClaims);

router.post("/api/admin/process-claim", processClaim);

module.exports = router;
