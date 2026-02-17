const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const ERRORS = require('../errors/errorCodes');

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError(
            ERRORS.TOKEN_REQUIRED.message,
            ERRORS.TOKEN_REQUIRED.status
        ));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        // res.redirect('/');
        return next(new AppError(
            ERRORS.INVALID_TOKEN.message,
            ERRORS.INVALID_TOKEN.status
        ));
    }
}
