
const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');
var success = require('./success')

function consulStatus(req, callback){
    const data = req.body;
    
    db.query(`CALL consulPet(?)`, [data.user], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.length > 0) {

                const dataToSend = result[0].map(item => ({
                    Cod_Barras: item.CBSC,
                    Arti: item.artic,
                    Cantidad: item.Cant,
                    Enviado: item.delivered_soli,
                    fecha: item.fecha
                }));

                return callback(null, { type: 'success',  dataToSend});
            } else {
                return callback(null, []); 
            }
        }
    });
}

module.exports = consulStatus
