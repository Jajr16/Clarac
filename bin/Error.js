async function Errores(Data) {
    fs.appendFile('ErrorLogs.txt', (Data.toString() + ` | Error obtenido el -> ${fechaDia}/${fechaMes}/${fechaAño} ${fechaHora}:${fechaMinutos}\n`), (error) => {
        if (error) {
            throw error;
        }
        console.log('Errores escritos');
    });
}

module.exports = Errores;