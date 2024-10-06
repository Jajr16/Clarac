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
                    db.query("select Área from empleado where Num_emp = ?", [result[0].Num_Emp], function (err, area) {
                        if (err) {
                            Errores(err);
                            return callback(err);
                        }

                        if (area.length > 0) {
                            let permisosModulos = {};
                            res.forEach(row => {
                                if (!permisosModulos[row.modulo]) {
                                    permisosModulos[row.modulo] = [];
                                }
                                permisosModulos[row.modulo].push(row.permiso);
                            });
                            console.log('ASdASD')
                            return callback(null, { type: 'success', Usuario: result[0].Usuario, permisosModulos, area: area[0].Área });
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
