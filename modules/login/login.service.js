// Login Service
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('./login.repository');

const AppError = require('../../errors/AppError');
const ERRORS = require('../../errors/errorCodes');

exports.login = async ({ username, password }) => {
    const user = await repo.findUserByUsername(username);
    if (!user) throw new AppError(
        ERRORS.INVALID_CREDENTIALS.message,
        ERRORS.INVALID_CREDENTIALS.status
    );

    // Validar contraseña
    if (user.password_version === 0) {
        if (password !== user.Pass) throw new AppError(
            ERRORS.INVALID_CREDENTIALS.message,
            ERRORS.INVALID_CREDENTIALS.status
        );
        const hash = await bcrypt.hash(password, 10);
        await repo.updateUserPassword(username, hash);
    } else {
        const isMatch = await bcrypt.compare(password, user.Pass);
        if (!isMatch) throw new AppError(
            ERRORS.INVALID_CREDENTIALS.message,
            ERRORS.INVALID_CREDENTIALS.status
        );
    }

    // Obtener permisos
    const perm = await repo.getUserPermissions(username);
    
    const permissions = {};
    perm.forEach(row => {
        permissions[row.modulo] ??= [];
        permissions[row.modulo].push(row.accion)
    });

    // Nombre y área del empleado
    const emp = await repo.getEmployeeAreaAndName(user.Num_Emp);
    if (!emp) throw new AppError(
        ERRORS.INVALID_CREDENTIALS.message,
        ERRORS.INVALID_CREDENTIALS.status
    );

    // Generar token JWT
    const token = jwt.sign(
        {
            num_emp: user.Num_Emp,
            username: user.Usuario,
            area: emp.area,
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )

    return {
        token,
        user: user.Usuario,
        area: emp.area,
        name: emp.Nom,
        permissions
    }
}