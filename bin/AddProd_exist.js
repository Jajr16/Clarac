const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');

async function prodExistAdd(req, callback) {
    const data = req.body;

    try {
        // Recorrer cada producto en el arreglo 'productos'
        for (const item of data.productos) {
            // Ejecutar el procedimiento almacenado para cada producto
            await new Promise((resolve, reject) => {
                db.query(
                    `CALL AgregarProdExistentes(?,?,?,?,?)`,
                    [data.factura, item.producto, item.cantidad, data.Dfactura, data.Proveedor],
                    (err2, result) => {
                        if (err2) {
                            Errores(err2); // Manejo del error
                            return reject(err2);
                        } else {
                            // Verificar el resultado de la llamada al procedimiento
                            console.log(result)
                            if (result[0] && result[0][0].status === 'Success') {
                                resolve();
                            } else if (result[0] && result[0][0].status === 'error') {
                                callback(null, {
                                    type: 'error',
                                    message: result[0][0].message
                                });
                            } else{
                                reject(new Error(`Error al insertar el producto. ${err2}`));
                            }
                        }
                    }
                );
            });
        }

        callback(null, {
            type: 'success',
            message: 'Todos los productos fueron añadidos con éxito.',
            data: { factura: data.factura }
        });
    } catch (error) {
        Errores(error);
        callback(null, {
            type: 'error',
            message: 'Ocurrió un error al procesar los productos.',
            error: error.message
        });
    }
}

module.exports = prodExistAdd;