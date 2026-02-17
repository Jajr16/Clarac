// middleware/attachPermissions.js
const repo = require('../modules/login/login.repository.js');

module.exports = async (req, res, next) => {
    try {
        const permissions = {};
        const rows = await repo.getUserPermissions(req.user.username);

        rows.forEach(row => {
            permissions[row.modulo] ??= [];
            permissions[row.modulo].push(row.accion);
        });

        req.userPermissions = permissions;
        next();
    } catch (err) {
        next(err);
    }
};
