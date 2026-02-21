const pool = require('../config/database');

class Doctor {
    static async create(doctorData) {
        const {
            full_name, date_of_birth, mobile, email, medical_council_reg_no,
            medical_council_name, registration_year, qualifications, university_name,
            graduation_year, experience_years, bio
        } = doctorData;

        const query = `
      INSERT INTO doctors (
        full_name, date_of_birth, mobile, email, medical_council_reg_no,
        medical_council_name, registration_year, qualifications, university_name,
        graduation_year, experience_years, bio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
        const values = [
            full_name, date_of_birth, mobile, email, medical_council_reg_no,
            medical_council_name, registration_year, qualifications, university_name,
            graduation_year, experience_years, bio
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll(limit = 10, offset = 0) {
        const query = 'SELECT * FROM doctors LIMIT $1 OFFSET $2';
        const { rows } = await pool.query(query, [limit, offset]);
        return rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM doctors WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    static async count() {
        const query = 'SELECT COUNT(*) FROM doctors';
        const { rows } = await pool.query(query);
        return parseInt(rows[0].count);
    }
}

module.exports = Doctor;
