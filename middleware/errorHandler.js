// middleware/errorHandler.js
const logger = require('../config/logger.js');

module.exports = (err, req, res, next) => {
    console.log(err);

    const status = err.statusCode || 500;

    if (!err.isOperational) {
        logger.error({
            message: err.message,
            stack: err.stack,
            url: req.originalUrl,
            user: req.user?.username
        });
    }

    res.status(status).json({
        message: status === 500
            ? 'Error interno del servidor'
            : err.message
    });
};