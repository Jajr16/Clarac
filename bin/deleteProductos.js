var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function delProduct(req, callback){
    var data = req.body

    db.query('select*from almacen', function (err, result) {
        if (err) {
            Errores(err); return callback(err); } else {
            if (result.length > 0) {
                db.query('update almacen set eliminado = 1 where Cod_Barras = ?;', [data.Cod_Barras], function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    } else {
                        if (result.affectedRows > 0) {
                            return callback(null, { type: 'success', message: 'Producto dado de baja.', Res: "Si" });
                        } else {
                            return callback(null, { type: 'error', message: "Producto no eliminado, inténtelo de nuevo." });
                        }
                    }
                });
            } else {
                return callback(null, { type: 'error', message: 'No hay datos para mostrar' });
            }
        }
    });
}

module.exports = delProduct