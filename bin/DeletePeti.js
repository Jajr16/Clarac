const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');
var success = require('./success')

function deletePeti(req, callback){
    const data = req.body;
    console.log(data)
    db.query(`CALL deletePeticion(?,?,?,?)`, [data.fecha, data.CB, data.user, data.cantidad], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            console.log(result)
            if (result.affectedRows > 0) {
                return callback(null, { type: 'success', message: 'Solicitud cancelada con éxito.'});
            } else {
                return callback(null, { message: 'Hubo un error al cancelar la solicitud.' }); 
            }
        }
    });
}

module.exports = deletePeti