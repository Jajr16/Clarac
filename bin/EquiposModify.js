var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')
var success = require('./success')

function modifyEqp(req, callback) {
    const data = req.body

    const Hardware = data.Hardware || null;
    const Software = data.Software || null;
    const Num_Serie_CPU = data.Num_Serie_CPU || null;
    const Mouse = data.Mouse || null;
    const Teclado = data.Teclado || null;
    const Accesorio = data.Accesorio || null;

    db.query(`CALL ActualizarEquipos(?,?,?,?,?,?,?,?,?,?,?,?,?)`, [data.Num_Serie, 
        data.Equipo, data.Marca, data.Modelo, data.Ubi, data.dataOldNS, data.User,
        Hardware, Software, Num_Serie_CPU, Mouse, Teclado, Accesorio], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (success(result) == 'Success') {
                return callback(null, { type: 'RespDelEqp', message: 'Equipo modificado con éxito.', data: { Num_Serie: data.Num_Serie } });
            } else {
                return callback(null, { type: 'ErrorModEqp', message: "No se pudo modificar el equipo." })
            }
        }
    });
}

module.exports = modifyEqp;