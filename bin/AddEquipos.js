var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function addEquipo(req, callback) {
    const data = req.body

    db.query('SELECT empleado.Num_Emp FROM empleado where empleado.Num_Emp = (select Num_Emp from Usuario where Usuario = ?)', [data.User], function (err, result) {
        if (err) { Errores(err); return callback(err); } // Se hace un control de errores
        else {
            if (result.length > 0) {//Si sí hizo una búsqueda

                var num_emp = result[0].Num_Emp; // Obtener el valor de Num_Emp del primer elemento del arreglo result

                db.query('insert into equipo values (NULL,?,?,?,?,?,?)', [data.Num_Serie, data.Equipo, data.Marca, data.Modelo, num_emp, data.Ubi], function (err2, result) {
                    if (err2) { Errores(err2); return callback(err); } // Se hace un control de errores
                    else {
                        if (result) {
                            return callback(null, { type: 'success', message: 'Equipo dado de alta.' })
                        } 
                    }
                });

            } else {
                return callback(null, { type: 'failed', message: 'El equipo no se pudo dar de alta.' })
            }
        }
    });

    
}

module.exports = addEquipo;