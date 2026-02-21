const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const config = require('./config/env');
const { errorResponse } = require('./utils/response');

// Import Route Aggregator
const routes = require('./routes/index');

const app = express();

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Static Uploads
app.use('/uploads', express.static(config.upload.path));

// Handlers
app.get('/', (req, res) => {
    res.json({ message: 'Healthcare API v2 Operational', env: config.env });
});

// API Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((req, res) => {
    errorResponse(res, 'Route not found', 404);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    errorResponse(res, err.message || 'Internal Server Error', err.statusCode || 500);
});

module.exports = app;
