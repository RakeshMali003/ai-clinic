const pool = require('../config/database');

class Appointment {
    static async create(data) {
        const { appointment_id, patient_id, doctor_id, appointment_date, type, mode, status } = data;
        const query = `
      INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, type, mode, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [appointment_id, patient_id, doctor_id, appointment_date, type, mode, status || 'scheduled'];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll(limit = 10, offset = 0) {
        const query = 'SELECT * FROM appointments ORDER BY appointment_date DESC LIMIT $1 OFFSET $2';
        const { rows } = await pool.query(query, [limit, offset]);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM appointments WHERE appointment_id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = Appointment;
