const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');

function consulStatus(req, callback){
    
    db.query(`CALL statusSolicitudesAlmacen()`, function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.length > 0) {

                const dataToSend = result[0].map(item => ({
                    Cod_Barras: item.CBA,
                    Arti: item.artic,
                    Cantidad: item.Cant,
                    fecha: item.fecha,
                    Nombre: item.Nom,
                    Estatus: item.status_solicitudes
                }));

                return callback(null, { type: 'success',  dataToSend});
            } else {
                return callback(null, []); 
            }
        }
    });
}

module.exports = consulStatus