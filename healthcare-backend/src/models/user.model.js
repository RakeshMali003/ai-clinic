const pool = require('../config/database');

class User {
    static async create(userData) {
        const { full_name, email, phone, role, password_hash } = userData;
        const query = `
      INSERT INTO users (full_name, email, phone, role, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, full_name, email, role
    `;
        const values = [full_name, email, phone, role, password_hash];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT user_id, full_name, email, phone, role FROM users WHERE user_id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = User;
