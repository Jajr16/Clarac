var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');

function Login(req, callback) {
    const { username, pass } = req.body;

    db.query('select*from usuario where Usuario = BINARY  ? and Pass = BINARY  ?', [username, pass], function (err, result) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (result.length > 0) {
            db.query("select permiso, modulo from permisos where Usuario = BINARY ?", [username], function (err, res) {
                if (err) {
                    Errores(err);
                    return callback(err);
                }

                if (res.length > 0) {
                    db.query("select Área, Nom from empleado where Num_emp = ?", [result[0].Num_Emp], function (err, res1) {
                        if (err) {
                            Errores(err);
                            return callback(err);
                        }

                        if (res1.length > 0) {
                            let permissions = {};
                            res.forEach(row => {
                                if (!permissions[row.modulo]) {
                                    permissions[row.modulo] = [];
                                }
                                permissions[row.modulo].push(row.permiso);
                            });
                            return callback(null, { type: 'success', Usuario: result[0].Usuario, permissions, area: res1[0].Área, empleado: res1[0].Nom });
                        } else {
                            return callback(null, { type: 'logInError', message: 'No se encontró el área del empleado.' });
                        }
                    });
                } else {
                    return callback(null, { type: 'logInError', message: 'El usuario no cuenta con ningún permiso.' });
                }
            });
        } else {
            return callback(null, { type: 'logInError', message: 'Nombre de usuario o contraseña incorrectos.' });
        }
    });
}

module.exports = Login;
