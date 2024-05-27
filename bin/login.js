var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function login(ws, data) {
    db.query('select*from usuario where Usuario = BINARY  ? and Pass = BINARY  ?', [data.username, data.password], function (err, result) {
        if (err) {
            Errores(err);
        } else {
            if (result.length > 0) {
                // Si el usuario existe en la base de datos, enviar información al cliente
                // Incluye permisos de módulos
                db.query("select permiso, modulo from permisos where Usuario = BINARY ?", [data.username], function (err, res) {
                    if (err) {
                        Errores(err);
                        
                    } else if (res.length > 0) {
                        db.query("select Área from empleado where Num_emp = ?", [result[0].Num_Emp], function (err, area) {
                            if (err) {
                                Errores(err);
                                
                            } else if (area.length > 0) {
                                // Organizar permisos por módulo y enviar al cliente
                                let permisosModulos = {};
                                res.forEach(row => {
                                    if (!permisosModulos[row.modulo]) {
                                        permisosModulos[row.modulo] = [];
                                    }
                                    permisosModulos[row.modulo].push(row.permiso);
                                });
                                ws.send(JSON.stringify({ type: 'success', Usuario: result[0].Usuario, permisosModulos, area: area[0].Área }))
                            }
                        });
                    } else {
                        ws.send(JSON.stringify({type: 'logInError', message: 'El usuario no cuenta con ningún permiso.' }))
                    }
                });
            } else {
                ws.send(JSON.stringify({type: 'logInError', message: 'Nombre de usuario o contraseña incorrectos.' }))
            }
        }
    });
}

module.exports = login;