require("express").Router();
const { pool } = require("pg");
const multer = require("multer");
const path = require("path");

const report = async (req, res) => {
  const { type, name, category, desc, location, date, userId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await pool.query(
      "INSERT INTO items (type, item_name, category, description, location, item_date, posted_by, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [type, name, category, desc, location, date, userId, imageUrl],
    );
    res.json({ message: "Item Reported" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllItems = async (req, res) => {
  // JOIN with users so we get the reporter's name
  const items = await pool.query(`
        SELECT items.*, users.full_name as reporter_name 
        FROM items 
        LEFT JOIN users ON items.posted_by = users.id 
        WHERE items.status != 'claimed' 
        ORDER BY items.id DESC
    `);
  res.json(items.rows);
};

module.exports = { report, getAllItems };
