const fs = require('fs');
const path = require('path');

function agregarNuevoElemento(elemento, archivo, callback) {
    console.log(`ESTOY ENTRANDO AQUÍ ${archivo} ${elemento}`)
    const jsonPath = path.join(__dirname, `../public/javascripts/${archivo}.json`);

    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) return callback({ success: false, message: 'Error al leer el archivo.', error: err });

        let datos;
        try {
            datos = JSON.parse(data);
        } catch (e) {
            return callback({ success: false, message: 'Error al parsear el JSON.', error: e });
        }

        let yaExiste = datos.some(eq =>
            eq.EQUIPO === elemento || eq.ARTICULO === elemento || eq.UBICACION === elemento
        );

        if (!yaExiste) {
            if (archivo === 'equipos_list') {
                datos.push({ EQUIPO: elemento });
            } else if (archivo === 'mobiliario_list') {
                datos.push({ ARTICULO: elemento });
            } else if (archivo === 'ubicaciones') {
                datos.push({ UBICACION: elemento })
            }
        }

        console.log(yaExiste)
        fs.writeFile(jsonPath, JSON.stringify(datos, null, 2), (err) => {
            if (err) return callback({ success: false, message: 'Error al escribir el archivo.', error: err });
            return callback({ success: true, message: 'Elemento agregado correctamente.' });
        });
    });
}

module.exports = { agregarNuevoElemento };