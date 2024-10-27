var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

function addEmpleado(req, callback) {
    const data = req.body
    
    db.query('CALL AgregarEmpleados(?,?,?,?)', [null, data.Nom, data.Area, 663], function (err, result) {
        if (err) { 
                Errores(err); // Otros errores
                return callback(err);
        } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda
                if (success(result) == 'Success'){
                    return callback(null, { type: 'success', message: 'Empleado dado de alta.' });
                }else {
                    Errores(`${result.Code, result.Message}`);
                    return callback(null, { type: 'failed', message: `El Empleado no se pudo dar de alta.` })
                }
                
            } else {
                return callback(null, { type: 'failed', message: 'El Empleado no se pudo dar de alta.' })
            }
        }
    });
}

function addUsuario(req, callback) {
    const data = req.body;
    console.log("Datos recibidos:", data);

    // Primero, agregar el usuario
    db.query('CALL AgregarUsuarios(?,?,?)', [data.Empleado, data.Usuario, data.Password], function (err, result) {
        if (err) {
            console.error('Error al agregar el usuario:', err);
            return callback(err);
        }

        console.log("Resultado de AgregarUsuarios:", result);  // Revisar el resultado de la inserción del usuario

        if (result.length > 0 && result[0][0].status === 'Success') {
            console.log("Usuario agregado correctamente, procediendo a agregar permisos.");

            // Ahora agregar los permisos para cada módulo
            let permisosAgregados = 0;
            const totalPermisos = data.Permisos.length;

            if (totalPermisos === 0) {
                return callback(null, { type: 'failed', message: 'No se encontraron permisos para agregar.' });
            }

            data.Permisos.forEach(permisoObj => {
                console.log(`Agregando permiso: ${permisoObj.Permiso}, módulo: ${permisoObj.Modulo}`);

                db.query('CALL AgregarPermisos(?,?,?)', [permisoObj.Permiso, data.Usuario, permisoObj.Modulo], function (errPerm, resultPerm) {
                    if (errPerm) {
                        console.error('Error al agregar los permisos:', errPerm);
                        return callback(errPerm);
                    }

                    console.log("Resultado de AgregarPermisos:", resultPerm);

                    permisosAgregados++;

                    // Si todos los permisos han sido insertados correctamente
                    if (permisosAgregados === totalPermisos) {
                        return callback(null, { type: 'success', message: 'Usuario y permisos dados de alta.' });
                    }
                });
            });
        } else {
            return callback(null, { type: 'failed', message: 'El Usuario no se pudo dar de alta.' });
        }
    });
}

function addPermisos(req, callback) {
    const data = req.body
    console.log("Datos recibidos:", data);
    db.query('CALL AgregarPermisos(?,?,?)', [data.Permiso, data.User, data.modulo], function (err, result) {
        if (err) { 
                Errores(err); // Otros errores
                return callback(err);
        } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda
                if (success(result) == 'Success'){
                    return callback(null, { type: 'success', message: 'Permisos dado de alta.' });
                }else {
                    Errores(`${result.Code, result.Message}`);
                    return callback(null, { type: 'failed', message: `Los Permisos no se dieron de alta.` })
                }
                
            } else {
                return callback(null, { type: 'failed', message: 'Los Permisos no se dieron de alta.' })
            }
        }
    });
}

// Función para obtener empleados de la base de datos
function obtenerEmpleados(callback) {
    const query = 'SELECT Nom FROM empleado';
    
    db.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        console.log("Resultados de la consulta:", results);
        callback(null, results);
    });
    
}

module.exports = {
    addEmpleado,
    addUsuario,
    addPermisos,
    obtenerEmpleados
};
