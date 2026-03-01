const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, id, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (full_name, student_id, password) VALUES ($1, $2, $3)', [name, id, hashedPassword]);
        res.json({ message: "Success" });
    } catch (err) { res.status(500).json({ error: "ID already exists" }); }
};

exports.login = async (req, res) => {
    const { id, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE student_id = $1', [id]);
        if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });
        
        const valid = await bcrypt.compare(password, user.rows[0].password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });
        
        const token = jwt.sign({ id: user.rows[0].id, isAdmin: user.rows[0].is_admin }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].full_name, isAdmin: user.rows[0].is_admin } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};