const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');
var success = require('./success')
var Empty = require('./Empty')
var formatearFecha = require('./formattedDate')

async function ConfirmPet(req, callback) {
    const data = req.body;
    const formattedDate = formatearFecha(data.fecha);
    console.log(data)
    console.log(formattedDate)

    db.query('CALL ConfirmPet(?,?,?)', [data.user, data.Cod_Barras, formattedDate], function (err, result) {
        if (err) { 
                Errores(err); // Otros errores
                return callback(err);
        } // Se hace un control de errores
        else {
            if (result.length > 0) {
                console.log(result)
                if (success(result) == 'Success'){
                    return callback(null, { type: 'success', message: result[0][0].message });
                }else if (Empty(result) == 'Empty'){
                    console.log(result[0][0].message)
                    return callback(null, { type: 'failed', message: result[0][0].message })
                } else {
                    Errores(`${result.Code, result.Message}`);
                    return callback(null, { type: 'error', message: 'Operación fallida' })
                }
            } else {
                return callback(null, { type: 'error', message: 'Operación no exitosa.' })
            }
        }
    });
}

module.exports = ConfirmPet;