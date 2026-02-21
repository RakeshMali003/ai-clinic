const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');

exports.register = async (req, res, next) => {
    try {
        const { full_name, email, phone, role, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return errorResponse(res, 'User already exists', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            full_name,
            email,
            phone,
            role: role || 'patient',
            password_hash
        });

        const token = jwt.sign({ id: newUser.user_id, role: newUser.role }, config.jwt.secret, {
            expiresIn: config.jwt.expire
        });

        successResponse(res, { token, user: newUser }, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 'Please provide email and password', 400);
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const token = jwt.sign({ id: user.user_id, role: user.role }, config.jwt.secret, {
            expiresIn: config.jwt.expire
        });

        const userResponse = {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        };

        successResponse(res, { token, user: userResponse }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.user_id);
        successResponse(res, user, 'Profile retrieved');
    } catch (error) {
        next(error);
    }
};
