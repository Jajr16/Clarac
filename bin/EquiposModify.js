var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error')

function modifyEqp(req, callback) {
    const data = req.body
    console.log(data)
    db.query('UPDATE equipo SET Num_Serie = ?, Equipo = ?, Marca = ?, Modelo = ?, Ubi = ? WHERE Num_Serie = ? AND Equipo = ?', [data.Num_Serie, data.Equipo, data.Marca, data.Modelo, num_emp, data.Ubi, data.dataOldNS, data.dataOldE], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.affectedRows > 0) { //Si sí hizo una búsqueda
                return callback(null, { type: 'RespDelEqp', message: 'Equipo modificado con éxito.', data: { Num_Serie: data.Num_Serie, Equipo: data.Equipo } });
            } else {
                return callback(null, { type: 'ErrorModEqp', message: "No se pudo modificar el equipo." })
            }
        }
    });
}

module.exports = modifyEqp;