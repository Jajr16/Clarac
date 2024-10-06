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

nombreArchivo = fechaDia + "_" + fechaMes + "_" + fechaAño + "--" + fechaHora + "-" + fechaMinutos

module.exports = nombreArchivo