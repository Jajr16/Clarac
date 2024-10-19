const db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
const Errores = require('./Error');

async function prodExistExtract(req, callback) {
    const data = req.body;
    const resultados = []; // Para almacenar los resultados de cada operación

    try {
        // Recorrer cada producto en el arreglo 'productos'
        for (const item of data.productos) {
            // Ejecutar el procedimiento almacenado para cada producto
            await new Promise((resolve, reject) => {
                db.query('CALL extractPE(?,?,?)', [item.producto, data.encargado, item.cantidad], function (err, res) {
                    if (err) {
                        Errores(err);
                        resultados.push({ type: 'error', message: `Error al sacar el producto ${item.producto}: ${err.message}` });
                        reject(err); // Rechazar la promesa en caso de error
                    } else {
                        // Evaluar el resultado devuelto por el procedimiento almacenado
                        const status = res[0][0].status;
                        const message = res[0][0].message;
                        if (status === 'Success') {
                            resultados.push({ type: 'Success', message });
                        } else {
                            resultados.push({ type: 'error', message });
                        }
                        resolve(); // Resolver la promesa si no hubo error
                    }
                });
            });
        }

        // Verificar si hay algún error en los resultados
        const hayError = resultados.some(resultado => resultado.type === 'error');
        console.log(resultados[0])
        // Si hubo algún error, marcar la operación completa como fallida
        if (hayError) {
            return callback(null, { type: 'error', message: resultados[0].message });
        } else {
            // Si no hubo errores, marcar la operación completa como exitosa
            return callback(null, { type: 'Success', message: resultados[0].message });
        }

    } catch (error) {
        Errores(error);
        return callback(null, {
            type: 'error',
            message: 'Ocurrió un error al procesar los productos.',
            error: error.message
        });
    }
}

module.exports = prodExistExtract;
