var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

function addEmpleado(req, callback) {
    const data = req.body
    console.log("Datos recibidos:", data);
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
    const data = req.body
    console.log("Datos recibidos:", data);
    db.query('CALL AgregarUsuarios(?,?,?)', [data.Empleado, data.Usuario, data.Password], function (err, result) {
        if (err) { 
                Errores(err); // Otros errores
                return callback(err);
        } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda
                if (success(result) == 'Success'){
                    return callback(null, { type: 'success', message: 'Usuario dado de alta.' });
                }else {
                    Errores(`${result.Code, result.Message}`);
                    return callback(null, { type: 'failed', message: `El Usuario no se pudo dar de alta.` })
                }
                
            } else {
                return callback(null, { type: 'failed', message: 'El Usuario no se pudo dar de alta.' })
            }
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
