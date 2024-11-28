"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (error, req, res, next) => {
    const statusCode = 500;
    const message = 'Something went wrong';
    res.status(statusCode).json({
        success: false,
        message,
        error: error,
    });
    return;
};
exports.default = globalErrorHandler;
