const pool = require('../config/database');

class Patient {
    static async create(patientData) {
        const {
            patient_id, full_name, age, gender, blood_group,
            abha_id, phone, address, medical_history, insurance_id
        } = patientData;

        const query = `
      INSERT INTO patients (
        patient_id, full_name, age, gender, blood_group, 
        abha_id, phone, address, medical_history, insurance_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
        const values = [
            patient_id, full_name, age, gender, blood_group,
            abha_id, phone, address, medical_history, insurance_id
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll(limit = 10, offset = 0) {
        const query = 'SELECT * FROM patients LIMIT $1 OFFSET $2';
        const { rows } = await pool.query(query, [limit, offset]);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM patients WHERE patient_id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    static async count() {
        const query = 'SELECT COUNT(*) FROM patients';
        const { rows } = await pool.query(query);
        return parseInt(rows[0].count);
    }
}

module.exports = Patient;
