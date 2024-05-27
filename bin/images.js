const mongoose = require('mongoose');
const WebSocket = require('ws');
const sql = require('../Conexion/BaseDatos');
const sizeOf = require('image-size');
var Errores = require('./Error')

// Esquema de la BD para MongoDB
const imagenSchema = new mongoose.Schema({
    _id: String,  // Usar un campo combinado como clave primaria
    Articulo: String,
    Descripcion: String,
    Empleado: String,
    imagen: { data: Buffer, contentType: String } // Aquí se guardará la imagen
});

// Crear el modelo
const Imagen = mongoose.model('Imagen', imagenSchema);

function guardarImagenEnBD(wss, data) {
    // Separar el encabezado de los datos base64
    console.log(data)
    const imagenBase64 = data.imagenBase64;
    const base64Data = imagenBase64.replace(/^data:image\/\w+;base64,/, "");

    // Convertir los datos base64 a un buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Realizar la consulta SQL
    sql.query('SELECT Num_Emp FROM usuario WHERE Usuario = ?', [data.empleado], async function (err, res) {
        if (err) {
            console.error(err); Errores(err);
        } else if (res.length > 0) {
            // Detectar el tipo de contenido de la imagen y las dimensiones
            const dimensions = sizeOf(buffer);

            const uniqueId = `${data.articulo}-${data.descripcion}-${res[0].Num_Emp}`;

            const update = {
                _id: uniqueId,
                Articulo: data.articulo,
                Descripcion: data.descripcion,
                Empleado: res[0].Num_Emp,
                imagen: {
                    data: buffer,
                    contentType: dimensions.type // Tipo de contenido detectado
                }
            }

            try {
                // Guardar la imagen en la base de datos
                const imagenGuardada = Imagen.findByIdAndUpdate(
                    uniqueId,
                    update,
                    { new: true, upsert: true} // Upsert hace que si no existe un registro lo crea
                );
                console.log('Imagen guardada con éxito:', imagenGuardada);

                // Enviar la imagen guardada a todos los clientes conectados
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'Imagen_Guardada', imagenBase64 }));
                    }
                });
            } catch (err) {
                console.error('Error al guardar la imagen:', err);
            }
        }
    });
}

module.exports = guardarImagenEnBD;
module.exports = Imagen;