var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function consulmob(req, callback) {
    const { username } = req.body;

    db.query('SELECT Área FROM empleado INNER JOIN usuario ON empleado.Num_emp = usuario.Num_emp WHERE usuario = ?', [username], function (err, res) {
        if (err) {
            Errores(err);
            return callback(err);
        }

        if (res.length > 0) { // Si se encontró el usuario
            if (!(res[0].Área === 'SISTEMAS')) {
                db.query('SELECT * FROM mobiliario', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => ({
                        Articulo: item.Articulo,
                        Descripcion: item.Descripcion,
                        Ubicacion: item.Ubicacion,
                        Cantidad: item.Cantidad,
                        Area: item.Área
                    }));

                    return callback(null, dataToSend);
                });
            } else {
                db.query('SELECT m.*, e.Nom FROM mobiliario m JOIN empleado e ON m.Num_emp = e.Num_emp', function (err, result) {
                    if (err) {
                        Errores(err);
                        return callback(err);
                    }

                    const dataToSend = result.map(item => ({
                        Articulo: item.Articulo,
                        Descripcion: item.Descripcion,
                        Ubicacion: item.Ubicacion,
                        Cantidad: item.Cantidad,
                        Area: item.Área
                    }));

                    return callback(null, dataToSend);
                });
            }
        } else {
            return callback(null, []); // Si no se encontró el usuario, devolver un arreglo vacío
        }
    });
}

module.exports = consulmob;
