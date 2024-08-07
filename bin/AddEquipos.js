var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function addEquipo(req, callback) {
    const data = req.body
    console.log(data)
    console.log(data.Num_Serie)

    db.query('insert into equipo values (NULL,?,?,?,?,?,?)', [data.Num_Serie, data.Equipo, data.Marca, data.Modelo, num_emp, data.Ubi], function (err2, result) {
        if (err2) { Errores(err2); return callback(err); } // Se hace un control de errores
        else {
            if (result) {
                return callback(null, { type: 'success', message: 'Equipo dado de alta.' })
            } else {
                return callback(null, { type: 'failed', message: 'El equipo no se pudo dar de alta.' })
            }
        }
    });
}

module.exports = addEquipo;