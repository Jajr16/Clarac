var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

function delFurnit(req, callback) {

    const data = req.body;

    console.log(data);

    const usuario = data.user || null;
    const encargado = data.encargado || null;

    db.query('select*from mobiliario', function (err, result) {
        if (err) { Errores(err); return callback(err) } // Se hace un control de errores
        else {
            if (result.length > 0) { //Si sí hizo una búsqueda

                db.query('CALL EliminarUEMob(?, ?, ?)', [data.articulo, usuario, encargado], function (err, result) {
                    if (err) { 
                        Errores(err); 
                        return callback(err); // Se hace un control de errores
                    } else {
                        if (result) {
                            if (success(result) == 'Success') {
                                console.log(result);
                
                                return callback(null, { type: 'success', message: 'Mobiliario eliminado correctamente.' });
                            } else {
                                Errores(`${result.Code}, ${result.Message}`);
                                return callback(null, { type: 'failed', message: 'No se pudo eliminar el mobiliario.' });
                            }
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