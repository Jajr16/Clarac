// middleware/hasPermissions.js
const AppError = require('../errors/AppError.js');
const ERRORS = require('../errors/errorCodes.js');

module.exports = (moduleName, permission) => {
    return (req, res, next) => {
        const permissions = req.userPermissions;

        if (!permissions?.[moduleName]?.includes(permission)) {
            return next(new AppError(
                ERRORS.FORBIDDEN.message,
                ERRORS.FORBIDDEN.status
            ));
        }

        next();
    };
};