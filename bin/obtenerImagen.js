const Imagen = require('./images');  // Importa tu modelo de Imagen

async function obtenerImagen(ws, data) {
    try {
        const uniqueId = `${data.articulo}-${data.descripcion}-${data.empleado}`;
        const imagen = await Imagen.findById(uniqueId);

        if (imagen) {
            const imagenBase64 = `data:${imagen.imagen.contentType};base64,${imagen.imagen.data.toString('base64')}`;
            const response = {
                type: 'Imagen_Obtenida',
                imagenBase64: imagenBase64
            };
            ws.send(JSON.stringify(response));
        } else {
            ws.send(JSON.stringify({ type: 'Error', message: 'Imagen no encontrada' }));
        }
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        ws.send(JSON.stringify({ type: 'Error', message: 'Error al obtener la imagen' }));
    }
}

module.exports = obtenerImagen;
