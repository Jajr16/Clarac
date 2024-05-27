const fs = require('fs');
const date = new Date();  // Obtener la fecha y hora actual
let fechaDia = date.getDate();
let fechaMes = date.getMonth() + 1;
let fechaAño = date.getFullYear();
let fechaHora = date.getHours();
let fechaMinutos = date.getMinutes();

// Formatear la fecha y hora para que tengan dos dígitos en caso necesario
if (fechaMes < 10) {
    fechaMes = "0" + fechaMes;
}
if (fechaDia < 10) {
    fechaDia = "0" + fechaDia;
}

async function Errores(Data) {
    fs.appendFile('ErrorLogs.txt', (Data.toString() + ` | Error obtenido el -> ${fechaDia}/${fechaMes}/${fechaAño} ${fechaHora}:${fechaMinutos}\n`), (error) => {
        if (error) {
            throw error;
        }
        console.log('Errores escritos');
    });
}

module.exports = Errores;