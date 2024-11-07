var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function getName(req, callback) {
    const data = req.body;
    
    db.query(`CALL getUserMob(?)`, [data.name], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result) {
                return callback(null, {Usuario: result[0][0].Usuario});
            } else {
                return callback(null, []); 
            }
        }
    });
}

module.exports = getName;
