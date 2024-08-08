var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function getEmploys(callback) {
    db.query('select Nom from empleado', function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        } else {
            if (res.length > 0) {
                const dataToSend = res.map(item => ({
                    employee: item.Nom
                }));

                return callback(null, dataToSend);
            }
        }
    });
}

module.exports = getEmploys;