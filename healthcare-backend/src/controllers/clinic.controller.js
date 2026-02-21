const { successResponse } = require('../utils/response');

exports.getAll = async (req, res, next) => {
    successResponse(res, [], 'Items retrieved');
};

exports.getById = async (req, res, next) => {
    successResponse(res, {}, 'Item retrieved');
};

exports.create = async (req, res, next) => {
    successResponse(res, req.body, 'Item created', 201);
};

exports.update = async (req, res, next) => {
    successResponse(res, req.body, 'Item updated');
};

exports.delete = async (req, res, next) => {
    successResponse(res, null, 'Item deleted');
};
