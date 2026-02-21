const prisma = require('../config/database');

class Clinic {
    static async create(clinicData) {
        try {
            const data = await prisma.clinics.create({
                data: clinicData
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findAll(limit = 10, offset = 0) {
        try {
            const data = await prisma.clinics.findMany({
                take: limit,
                skip: offset
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const data = await prisma.clinics.findUnique({
                where: { id: id }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, updates) {
        try {
            const data = await prisma.clinics.update({
                where: { id: parseInt(id) },
                data: { ...updates, updated_at: new Date() }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const data = await prisma.clinics.delete({
                where: { id: parseInt(id) }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async count() {
        try {
            const count = await prisma.clinics.count();
            return count;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Clinic;
