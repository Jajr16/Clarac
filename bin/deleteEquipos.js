var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function delEquip(req, callback) {
    const data = req.body

    db.query('select * from equipo', function (err, result) {
        if (err) { Errores(err); return callback(err) } // Se hace un control de errores
        else {
            if (result.length > 0) { //Si sí hizo una búsqueda
                db.query('delete from equipo where Num_Serie = ? and Num_emp in (select Num_Emp from usuario where Usuario = ?)', [data.Num_Serie, data.user], function (err, result) {
                    if (err) { Errores(err); return callback(err) } // Se hace un control de errores
                    else {
                        if (result.affectedRows > 0) {
                            return callback(null, { type: 'success', message: 'Equipo dado de baja.' })
                        } else {
                            return callback(null, { err: true, message: "Equipo no eliminado, inténtelo de nuevo." });
                        }
                    }
                });

            } else {
                return callback(null, { err: true, message: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
        }
    });
}

module.exports = delEquip;