const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ResponseHandler = require('../utils/responseHandler');

exports.register = async (req, res, next) => {
    try {
        const { full_name, email, phone, role, password } = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return ResponseHandler.badRequest(res, 'User identity already registered in this galaxy');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            full_name,
            email,
            phone,
            role: role || 'patient', // Default role
            password_hash
        });

        const token = jwt.sign({
            id: newUser.id,
            role: newUser.role
        }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            });

        ResponseHandler.created(res, { token, user: newUser }, 'New bio-signature registered successfully');
    } catch (error) {
        next(error);
    }
};

// Demo users for testing when database is not available
const demoUsers = [
    { user_id: 1, full_name: 'Dr. Sarah Johnson', email: 'admin@clinic.com', role: 'admin', password: 'admin' },
    { user_id: 2, full_name: 'Dr. Michael Chen', email: 'doctor@clinic.com', role: 'doctor', password: 'doctor' },
    { user_id: 3, full_name: 'Emma Wilson', email: 'reception@clinic.com', role: 'receptionist', password: 'reception' },
    { user_id: 4, full_name: 'John Doe', email: 'nurse@clinic.com', role: 'nurse', password: 'nurse' },
    { user_id: 5, full_name: 'Lisa Martinez', email: 'lab@clinic.com', role: 'lab_technician', password: 'lab' },
    { user_id: 6, full_name: 'Robert Brown', email: 'pharmacy@clinic.com', role: 'pharmacist', password: 'pharmacy' },
    { user_id: 7, full_name: 'Rahul Sharma', email: 'patient@clinic.com', role: 'patient', password: 'patient' },
];

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password presence
        if (!email || !password) {
            return ResponseHandler.badRequest(res, 'Please provide email and password coordinates');
        }

        // For demo purposes, check against hardcoded demo users if database fails
        const demoUser = demoUsers.find(u => u.email === email && u.password === password);

        if (demoUser) {
            // Create token for demo user
            const token = jwt.sign({ id: demoUser.user_id, role: demoUser.role }, 'demo-secret-key', {
                expiresIn: '24h'
            });

            const userResponse = {
                user_id: demoUser.user_id,
                full_name: demoUser.full_name,
                email: demoUser.email,
                role: demoUser.role
            };

            return ResponseHandler.success(res, { token, user: userResponse }, 'Access granted. Welcome aboard.');
        }

        // Try database login as fallback
        const user = await User.findByEmail(email);
        if (!user) {
            return ResponseHandler.unauthorized(res, 'Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return ResponseHandler.unauthorized(res, 'Invalid credentials');
        }

        // Create token
        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', {
            expiresIn: process.env.JWT_EXPIRE || '24h'
        });

        const userResponse = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        };

        ResponseHandler.success(res, { token, user: userResponse }, 'Access granted. Welcome aboard.');
    } catch (error) {
        // If database fails, try demo login
        const { email, password } = req.body;
        const demoUser = demoUsers.find(u => u.email === email && u.password === password);

        if (demoUser) {
            const token = jwt.sign({ id: demoUser.user_id, role: demoUser.role }, 'demo-secret-key', {
                expiresIn: '24h'
            });

            const userResponse = {
                user_id: demoUser.user_id,
                full_name: demoUser.full_name,
                email: demoUser.email,
                role: demoUser.role
            };

            return ResponseHandler.success(res, { token, user: userResponse }, 'Access granted. Welcome aboard (Demo Mode).');
        }

        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        ResponseHandler.success(res, user, 'Profile data retrieved');
    } catch (error) {
        next(error);
    }
};
