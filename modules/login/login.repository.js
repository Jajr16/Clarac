// Login Repository
var db = require("../../config/BaseDatos");

exports.findUserByUsername = async (username) => {
    const [rows] = await db.query(
        `SELECT Usuario, Pass, Num_Emp, password_version 
        FROM usuario 
        WHERE Usuario = BINARY ?`,
        [username]
    );

    return rows[0] || null;
};

exports.getUserPermissions = async (username) => {
    const [rows] = await db.query(`
        SELECT 
            m.nombre AS modulo,
            p.accion
        FROM usuario_permiso up
        JOIN catalogo_modulos m ON up.modulo_id = m.id
        JOIN catalogo_permisos p ON up.codigo_permiso = p.codigo
        WHERE up.usuario = ?
    `, [username]);

    return rows;
};

exports.getEmployeeAreaAndName = async (numEmp) => {
    const [rows] = await db.query(
        'SELECT Área as area, Nom FROM empleado WHERE Num_emp = ?',
        [numEmp]
    );

    return rows[0] || null;
};

exports.updateUserPassword = async (username, hash) => {
    const [result] = await db.query(
        'UPDATE usuario SET Pass = ?, password_version = 1 WHERE Usuario = BINARY ?',
        [hash, username]
    );

    return result;
};
