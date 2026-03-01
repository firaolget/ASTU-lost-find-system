const { pool } = require("pg");


const submitClaim = async (req, res) => {
  const { itemId, userId, telegram, gmail, proof } = req.body;
  try {
    await pool.query(
      "INSERT INTO claims (item_id, user_id, telegram_user, gmail, proof_text) VALUES ($1, $2, $3, $4, $5)",
      [itemId, userId, telegram, gmail, proof],
    );
    res.json({ message: "Claim submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getAllClaims = async (req, res) => {
  const claims = await pool.query(`
        SELECT c.*, u.full_name as claimant_name, i.item_name 
        FROM claims c 
        JOIN users u ON c.user_id = u.id 
        JOIN items i ON c.item_id = i.id
    `);
  res.json(claims.rows);
}

const processClaim = async (req, res) => {
  const { claimId, itemId, action } = req.body;
  try {
    if (action === "approve") {
      await pool.query("UPDATE items SET status = 'claimed' WHERE id = $1", [
        itemId,
      ]);
    }
    await pool.query("DELETE FROM claims WHERE id = $1", [claimId]);
    res.json({ message: "Processed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { submitClaim, getAllClaims, processClaim };