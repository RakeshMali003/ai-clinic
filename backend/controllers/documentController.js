const prisma = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');
const Patient = require('../models/patientModel');

async function getPatientId(req) {
    if (req.user.patient_id) return req.user.patient_id;

    const userId = req.user.user_id;
    let patient = await prisma.patients.findFirst({ where: { user_id: userId } });
    if (!patient && req.user.email) {
        patient = await prisma.patients.findFirst({ where: { email: req.user.email } });
    }
    return patient ? patient.patient_id : null;
}

exports.uploadDocument = async (req, res, next) => {
    try {
        const patient_id = await getPatientId(req);
        if (!patient_id) return ResponseHandler.notFound(res, 'Patient not found');

        if (!req.file) {
            return ResponseHandler.badRequest(res, 'No file uploaded');
        }

        const { document_type } = req.body;
        const file_url = `/uploads/${req.file.filename}`;
        const file_name = req.file.originalname;

        const document = await prisma.patient_documents.create({
            data: {
                patient_id,
                document_type: document_type || 'Other',
                file_url,
                file_name
            }
        });

        ResponseHandler.created(res, document, 'Document uploaded successfully');
    } catch (error) {
        next(error);
    }
};

exports.getMyDocuments = async (req, res, next) => {
    try {
        const patient_id = await getPatientId(req);
        if (!patient_id) return ResponseHandler.notFound(res, 'Patient not found');

        const documents = await prisma.patient_documents.findMany({
            where: { patient_id },
            orderBy: { uploaded_at: 'desc' }
        });

        ResponseHandler.success(res, documents, 'Documents retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient_id = await getPatientId(req);

        const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(id) } });
        if (!doc || doc.patient_id !== patient_id) {
            return ResponseHandler.notFound(res, 'Document not found');
        }

        await prisma.patient_documents.delete({ where: { id: parseInt(id) } });

        ResponseHandler.success(res, null, 'Document deleted');
    } catch (error) {
        next(error);
    }
};
