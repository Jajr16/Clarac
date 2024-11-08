var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

function modEmpleado(req, callback) {
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

function modUsuario(req, callback) {
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

function modPermisos(req, callback) {
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

function obtenerRegistrosUsuarios(callback) {
    const query = `
        SELECT usuario.Num_emp AS numemp, 
               empleado.Nom AS nombre, 
               COALESCE(usuario.usuario, '-') AS usuario, 
               usuario.Pass AS password
        FROM usuario
        JOIN empleado ON usuario.Num_emp = empleado.Num_emp
    `;
    db.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // console.log("Resultados de la consulta:", results); // Asegúrate de que `num_emp` esté aquí
        callback(null, results);
    });
}

function obtenerRegistrosEmpleados(callback) {
    const query = `SELECT Num_emp as numemp, Nom AS nombre, Área as area FROM empleado`;
    db.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // console.log("Resultados de la consulta:", results);
        callback(null, results);
    });
    
}

function obtenerEmpleados(callback) {
    const query = 'SELECT Nom FROM empleado';
    
    db.query(query, (error, results) => {
        if (error) {
            return callback(error, null);
        }
        // console.log("Resultados de la consulta:", results);
        callback(null, results);
    });
    
}

function obtenerPermisosPorUsuario(usuario, callback) {
    const query = `
        SELECT permiso, modulo
        FROM permisos
        WHERE usuario = ?
    `;

    db.query(query, [usuario], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
}

function modifyRegUsu(req, res) {
    const data = req.body;

    db.query(`CALL ActualizarRegUsu(?, ?, ?)`, [data.Num_emp, data.Usuario, data.Password], function (err, result) {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error al modificar el usuario', details: err });
        }
        
        if (result && Array.isArray(result) && result[0].length > 0) {
            const response = result[0][0];
            
            if (response.status === 'Success') {
                return res.status(200).json({ type: 'RespDelEqp', message: 'Usuario modificado exitosamente.' });
            } else {
                return res.status(500).json({ type: 'error', message: 'Error en la modificación del usuario.' });
            }
        } else {
            return res.status(404).json({ message: 'No se encontró el usuario.' });
        }
    });
}

function modifyRegemp(req, res) {
    const data = req.body;

    db.query(`CALL ActualizarRegEmp(?, ?, ?)`, [data.Num_emp, data.Nombre, data.Area], function (err, result) {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error al modificar el empleado', details: err });
        }
        
        if (result && Array.isArray(result) && result[0].length > 0) {
            const response = result[0][0];
            
            if (response.status === 'Success') {
                return res.status(200).json({ type: 'RespDelEqp', message: 'Empleado modificado exitosamente.' });
            } else {
                return res.status(500).json({ type: 'error', message: 'Error en la modificación del empleado.' });
            }
        } else {
            return res.status(404).json({ message: 'No se encontró el empleado.' });
        }
    });
}

function modifyRegPer(req, res) {
    const { Usuario, Permissions } = req.body;

    // Check if Usuario and Permissions are provided
    if (!Usuario || !Permissions || !Array.isArray(Permissions)) {
        return res.status(400).json({ message: 'Datos inválidos. Asegúrese de proporcionar Usuario y Permissions.' });
    }

    // Convert Permissions array to a JSON string
    const permisosJson = JSON.stringify(Permissions);
    // Call the stored procedure
    db.query(`CALL ModificarPermisos(?, ?)`, [Usuario, permisosJson], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ message: 'Error al modificar los permisos', details: err });
        }
        
        const response = result[0][0];
        if (response.status === 'Success') {
            return res.status(200).json({ type: 'RespDelEqp', message: 'Permisos modificados exitosamente.' });
        }
    });
}

module.exports = {
    addEmpleado: modEmpleado,
    addUsuario: modUsuario,
    addPermisos: modPermisos,
    obtenerRegistrosUsuarios: obtenerRegistrosUsuarios,
    obtenerRegistrosEmpleados: obtenerRegistrosEmpleados,
    obtenerPermisosPorUsuario: obtenerPermisosPorUsuario,
    obtenerEmpleados: obtenerEmpleados,
    modifyRegUsu: modifyRegUsu,
    modifyRegemp: modifyRegemp,
    modifyRegPer: modifyRegPer
};
