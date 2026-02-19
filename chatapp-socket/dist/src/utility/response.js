"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateResponse = (res, isSuccess, message, code, data = null) => {
    const result = {
        isSuccess,
        message,
        code,
        data,
    };
    return res.status(code).json(result);
};
const successResponse = (res, data, message = "success") => {
    return generateResponse(res, true, message, 200, data);
};
const paginatedResponse = (res, data, total, offset, message = "success") => {
    return successResponse(res, {
        items: data,
        pagination: {
            total,
            offset,
        },
    }, message);
};
const notFoundResponse = (res, message = "Not found") => {
    return generateResponse(res, false, message, 404);
};
const internalFailureResponse = (res, data = null) => {
    return generateResponse(res, false, "internal server error", 500, data);
};
const authFailureResponse = (res, message = "Unauthorized") => {
    return generateResponse(res, false, message, 401);
};
const conflictResponse = (res, message = "Conflict") => {
    return generateResponse(res, false, message, 409);
};
const badRequestResponse = (res, message = "Bad request") => {
    return generateResponse(res, false, message, 400);
};
const comingSoonResponse = (_req, res, _next) => {
    return successResponse(res, {}, "Coming soon....");
};
const failedValidationResponse = (res, errors) => {
    return generateResponse(res, false, "Validation failed.", 400, { errors });
};
exports.default = {
    successResponse,
    paginatedResponse,
    internalFailureResponse,
    badRequestResponse,
    authFailureResponse,
    notFoundResponse,
    conflictResponse,
    comingSoonResponse,
    failedValidationResponse,
    generateResponse,
};
