const { OpenAI } = require('openai');
const ResponseHandler = require('../utils/responseHandler');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.explainReport = async (req, res, next) => {
    try {
        const { report_content, language } = req.body; // language can be 'English' or 'Hindi'

        if (!report_content) {
            return ResponseHandler.badRequest(res, 'Report content is required for AI explanation');
        }

        const prompt = `Explain the following medical report in detail for a patient who is not a medical professional. 
        Provide the explanation in ${language || 'English'}. 
        Focus on key findings, what they mean, and potential next steps.
        Report Content: ${report_content}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant providing medical report explanations in simple terms." },
                { role: "user", content: prompt }
            ],
        });

        const explanation = completion.choices[0].message.content;
        ResponseHandler.success(res, { explanation }, 'AI report explanation generated');
    } catch (error) {
        console.error('OpenAI Error:', error);
        next(error);
    }
};

exports.explainPrescription = async (req, res, next) => {
    try {
        const { prescription_details, language } = req.body;

        if (!prescription_details) {
            return ResponseHandler.badRequest(res, 'Prescription details required for AI explanation');
        }

        const prompt = `Explain this medical prescription for a patient. 
        Provide the explanation in ${language || 'English'}.
        Include:
        1. Purpose of each medication (if known).
        2. Important instructions (dosage, frequency).
        3. Simple lifestyle advice based on the prescription.
        Prescription Details: ${prescription_details}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant explaining medical prescriptions." },
                { role: "user", content: prompt }
            ],
        });

        const explanation = completion.choices[0].message.content;
        ResponseHandler.success(res, { explanation }, 'AI prescription explanation generated');
    } catch (error) {
        console.error('OpenAI Error:', error);
        next(error);
    }
};
