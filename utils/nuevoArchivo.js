const fs = require('fs');
const path = require('path');

function agregarNuevoElemento(elemento, archivo, callback) {
    const jsonPath = path.join(__dirname, `../public/javascripts/${archivo}.json`);

    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) return callback({ success: false, message: 'Error al leer el archivo.', error: err });

        let datos;
        try {
            datos = JSON.parse(data);
        } catch (e) {
            return callback({ success: false, message: 'Error al parsear el JSON.', error: e });
        }

        const yaExiste = datos.some(eq =>
            eq.EQUIPO === elemento || eq.ARTICULO === elemento
        );

        if (!yaExiste) {
            if (archivo === 'equipos_list') {
                datos.push({ EQUIPO: elemento });
            } else if (archivo === 'mobiliario_list') {
                datos.push({ ARTICULO: elemento });
            }
        }

        fs.writeFile(jsonPath, JSON.stringify(datos, null, 2), (err) => {
            if (err) return callback({ success: false, message: 'Error al escribir el archivo.', error: err });
            return callback({ success: true, message: 'Elemento agregado correctamente.' });
        });
    });
}

module.exports = { agregarNuevoElemento };