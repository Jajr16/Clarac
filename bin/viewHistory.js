const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');

function consulHistory(req, callback){
    const data = req.body;
    
    db.query(`CALL HistorySolicitudesDir(?)`, [data.user], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.length > 0) {
                console.log(result)
                const dataToSend = result[0].map(item => ({
                    Cod_Barras: item.CBA || 'N/A',
                    Arti: item.artic,
                    Cantidad: item.Cant,
                    fecha: item.fecha,
                    Nombre: item.Nom,
                    Estatus: item.status_solicitudes
                }));
                console.log(dataToSend)
                return callback(null, { type: 'success',  dataToSend});
            } else {
                return callback(null, []); 
            }
        }
    });
}

module.exports = consulHistory