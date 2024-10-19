var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function prodExistConsul(req, callback) {

    db.query('CALL consulPE()', function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (res.length > 0) {
            const dataToSend = res[0].map(item => ({
                Cod_Barras: item.CB,
                Articulo: item.Arti,
                Existencia: item.Existencia
            }));
            
            return callback(null, dataToSend);
        } else {
            return callback(null, []); // Si no se encontró el usuario, devolver un arreglo vacío
        }
    });
}

module.exports = prodExistConsul;
