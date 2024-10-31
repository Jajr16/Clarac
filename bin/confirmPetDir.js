const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');
var success = require('./success')
var Empty = require('./Empty')

async function confirmPetDir(req, callback) {
    const data = req.body;
    
    try {
        // Recorrer cada producto en el arreglo 'productos'
        for (const item of data.selectedItems) {
            // Ejecutar el procedimiento almacenado para cada producto
            await new Promise((resolve, reject) => {
                db.query(
                    `CALL ConfirmPetDir(?,?,?,?)`, [item.Cod_Barras, item.empleado, item.fecha, data.op],
                    (err2, result) => {
                        if (err2) {
                            Errores(err2); // Manejo del error
                            return reject(err2);
                        } else {
                            // Verificar el resultado de la llamada al procedimiento
                            console.log(result)
                            if (success(result) === 'Success') {
                                resolve();
                            } else if (result[0] && result[0][0].status === 'error') {
                                callback(null, {
                                    type: 'error',
                                    message: result[0][0].message
                                });
                            } else {
                                reject(new Error(`Error en la operación de las peticiones. ${err2}`));
                            }
                        }
                    }
                );
            });
        }

        callback(null, {
            type: 'success',
            message: 'Operación exitosa.'
        });
    } catch (error) {
        Errores(error);
        callback(null, {
            type: 'error',
            message: 'Ocurrió un error en la operación.',
            error: error.message
        });
    }
    // db.query('CALL ConfirmPetDir(?,?,?,?)', [data.Cod_Barras, data.empleado, data.fecha, data.op], function (err, result) {
    //     if (err) { 
    //             Errores(err); // Otros errores
    //             return callback(err);
    //     } // Se hace un control de errores
    //     else {
    //         if (result.length > 0) {
    //             if (success(result) == 'Success'){
    //                 return callback(null, { type: 'success', message: result[0][0].message });
    //             }else if (Empty(result) == 'Empty'){
    //                 console.log(result[0][0].message)
    //                 return callback(null, { type: 'failed', message: result[0][0].message })
    //             } else {
    //                 Errores(`${result.Code, result.Message}`);
    //                 return callback(null, { type: 'error', message: 'Operación fallida' })
    //             }
    //         } else {
    //             return callback(null, { type: 'error', message: 'Operación no exitosa.' })
    //         }
    //     }
    // });
}

module.exports = confirmPetDir;