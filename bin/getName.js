var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');

function getName(req, callback) {
    const data = req.body;

    db.query(`CALL getUserMob(?)`, [data.name], function (err2, result) {
        if (err2) {
            Errores(err2); // Manejo del error
            return callback(err2);
        } else {
            // Validar que el resultado no sea vacío y contenga la estructura esperada
            if (result && result[0] && result[0][0]) {
                const usuario = result[0][0].Usuario; // Extraer el usuario correctamente
                console.log("El usuario es: " + usuario);
                console.log("Resultado completo del procedimiento:", result);
                return callback(null, { Usuario: usuario });
            } else {
                console.log("No se encontró el usuario.");
                return callback(null, { Usuario: null }); // O devolver un valor indicativo
            }
        }
    });
}

module.exports = getName;