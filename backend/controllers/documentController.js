const prisma = require('../config/database');
const ResponseHandler = require('../utils/responseHandler');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res, next) => {
    try {
        const { document_type } = req.body;
        const patient_id = req.user.patient_id; // Need to ensure patient_id is available in req.user

        if (!req.file) {
            return ResponseHandler.badRequest(res, 'No file provided for upload');
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        const document = await prisma.patient_documents.create({
            data: {
                patient_id: patient_id,
                document_type: document_type || 'General',
                file_url: fileUrl
            }
        });

        ResponseHandler.created(res, document, 'Document uploaded successfully');
    } catch (error) {
        next(error);
    }
};

exports.getPatientDocuments = async (req, res, next) => {
    try {
        const patient_id = req.user.patient_id;

        const documents = await prisma.patient_documents.findMany({
            where: { patient_id: patient_id },
            orderBy: { uploaded_at: 'desc' }
        });

        ResponseHandler.success(res, documents, 'Patient documents retrieved');
    } catch (error) {
        next(error);
    }
};

exports.downloadDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const document = await prisma.patient_documents.findUnique({
            where: { id: parseInt(id) }
        });

        if (!document) {
            return ResponseHandler.notFound(res, 'Document not found');
        }

        // Check if patient owns this document
        if (document.patient_id !== req.user.patient_id) {
            return ResponseHandler.forbidden(res, 'Access denied to this document');
        }

        const filePath = path.join(__dirname, '..', document.file_url);

        if (!fs.existsSync(filePath)) {
            return ResponseHandler.notFound(res, 'Physical file not found on disk');
        }

        res.download(filePath);
    } catch (error) {
        next(error);
    }
};
