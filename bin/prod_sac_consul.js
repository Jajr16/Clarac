var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');

function prodSacConsul(req, callback) {

    db.query('CALL consulRPS()', function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (res.length > 0) {
            const dataToSend = res[0].map(item => ({
                Cod_BarrasS: item.Cod_BarrasS,
                FSalida: item.FSalida,
                Cantidad_Salida: item.Cantidad_Salida,
                Articulo: item.Articulo,
                Nombre_Empleado: item.Nombre_Empleado  // Accede al nombre del empleado
            }));
            
            return callback(null, dataToSend);
        } else {
            return callback(null, []); // Si no se encontró ningún resultado, devolver un arreglo vacío
        }
    });
}

module.exports = prodSacConsul;
