var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consuleqp(req, callback) {
    const { username } = req.body;

    db.query('SELECT Área FROM empleado INNER JOIN usuario ON empleado.Num_emp = usuario.Num_emp WHERE usuario = ?', [username], function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (res.length > 0) { // Si se encontró el usuario
            if (!(res[0].Área === 'SISTEMAS')) {
                db.query('SELECT * FROM equipo', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => ({
                        Num_Serie: item.Num_Serie,
                        Equipo: item.Equipo,
                        Marca: item.Marca,
                        Modelo: item.Modelo,
                        Ubi: item.Ubi
                    }));
                    return callback(null, dataToSend);
                });
            } else {
                db.query('SELECT * FROM equipo', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => ({
                        Num_Serie: item.Num_Serie,
                        Equipo: item.Equipo,
                        Marca: item.Marca,
                        Modelo: item.Modelo,
                        Ubi: item.Ubi
                    }));

                    return callback(null, dataToSend);
                });
            }
        } else {
            return callback(null, []); // Si no se encontró el usuario, devolver un arreglo vacío
        }
    });
}

module.exports = consuleqp;
