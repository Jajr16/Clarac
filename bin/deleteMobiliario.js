var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function delFurnit(req, callback) {
    const data = req.body
    db.query('select*from mobiliario', function (err, result) {
        if (err) { Errores(err); return callback(err) } // Se hace un control de errores
        else {
            if (result.length > 0) { //Si sí hizo una búsqueda
                db.query('delete from mobiliario where Articulo = ? and Descripcion = ? and Num_emp in (select Num_Emp from usuario where Usuario = ?)', [data.articulo, data.descripcion, data.user], function (err, result) {
                    if (err) { Errores(err); return callback(err) } // Se hace un control de errores
                    else {
                        if (result.affectedRows > 0) {
                            return callback(null, { type: 'success', message: 'Mobiliario dado de baja.' })
                        } else {
                            return callback(null, { err: true, message: "Mobiliario no eliminado, inténtelo de nuevo." });
                        }
                    }
                });

            } else {
                return callback(null, { err: true, message: 'No hay datos para mostrar' });//Mandar mensaje de error a cliente
            }
        }
    });
}

module.exports = delFurnit;