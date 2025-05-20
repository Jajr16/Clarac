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

function getUsersAndEmploys(callback) {
    db.query('select e.Nom, u.usuario from empleado e INNER JOIN usuario u ON u.Num_Emp = e.Num_emp', function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        } else {
            if (res.length > 0) {
                const dataToSend = res.map(item => ({
                    employee: item.Nom,
                    user: item.usuario
                }));

                return callback(null, dataToSend);
            }
        }
    });
}

module.exports = {getUsersAndEmploys, getEmploys}