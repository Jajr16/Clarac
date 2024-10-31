const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');
var success = require('./success')

function consulSol(req, callback){
    const data = req.body;
    console.log(data)
    
    db.query(`CALL consulPetDir(?)`, [data.user], function (err2, result) {
        if (err2) { Errores(err2); } // Se hace un control de errores
        else {
            if (result.length > 0) {

                const dataToSend = result[0].map(item => ({
                    Cod_Barras: item.Cod_Barras_SC,
                    Arti: item.Articulo,
                    Cantidad: item.cantidad_SC,
                    Nom: item.Nom,
                    fecha: item.request_date
                }));

                return callback(null, { type: 'success',  dataToSend});
            } else {
                return callback(null, []); 
            }
        }
    });
}

module.exports = consulSol