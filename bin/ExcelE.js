const db = require("../Conexion/BaseDatos");
const Errores = require('./Error');
const Excel = require('exceljs');
const nombreArchivo = require('./dates');

let contador = 1;

const createWorksheet = (workbook) => {
    const worksheet = workbook.addWorksheet("My Sheet");
    worksheet.columns = [
        { header: 'N. Inv', key: 'N_Inv', width: 11 },
        { header: 'Equipo', key: 'Eqp', width: 30 },
        { header: 'Marca', key: 'Marca', width: 25 },
        { header: 'Modelo', key: 'Modelo', width: 30 },
        { header: 'N. Serie', key: 'NS', width: 18 },
        { header: 'Hardware', key: 'Hardware', width: 30 },
        { header: 'Software', key: 'Software', width: 30 },
        { header: 'Monitor', key: 'Monitor', width: 30 },
        { header: 'Teclado', key: 'Teclado', width: 15 },
        { header: 'Mouse', key: 'Mouse', width: 20 },
        { header: 'Accesorio', key: 'Acces', width: 20 },
        { header: 'Encargado', key: 'Encargado', width: 40 }
    ];
    return worksheet;
};

const applyHeaderStyle = (worksheet) => {
    for (let i = 'A'.charCodeAt(0); i <= 'L'.charCodeAt(0); i++) {
        const cell = String.fromCharCode(i) + '1';
        worksheet.getCell(cell).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F003A9E' }
        };
        worksheet.getCell(cell).font = {
            name: 'Arial',
            color: { argb: 'FFFFFF' },
            bold: true
        };
    }
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.autoFilter = 'A:L';
};

const getExcelE = async (res) => {
    const workbook = new Excel.Workbook();
    const worksheet = createWorksheet(workbook);

    try {
        db.query(`
            SELECT DISTINCT 
                Equipo.N_Inventario, Equipo.Num_Serie, Equipo.Equipo, Equipo.Marca, Equipo.Modelo,
                empleado.Nom, 
                IFNULL(pcs.Hardware, "-") Hardware,
                IFNULL(pcs.Software, "-") Software,
                IFNULL(Monitor.Num_Serie_CPU, "-") Monitor,
                IFNULL(mouse.Mouse, "-") Mouse,
                IFNULL(teclado.Teclado, "-") Teclado,
                IFNULL(accesorio.Accesorio, "-") Accesorio
            FROM Equipo
            LEFT JOIN PCs ON Equipo.Num_Serie = PCs.Num_Serie
            LEFT JOIN Monitor ON Equipo.Num_Serie = Monitor.Num_Serie_Monitor
            LEFT JOIN Mouse ON Equipo.Num_Serie = Mouse.Num_Serie
            LEFT JOIN Teclado ON Equipo.Num_Serie = Teclado.Num_Serie 
            LEFT JOIN Accesorio ON Equipo.Num_Serie = Accesorio.Num_Serie 
            join empleado on Equipo.Num_emp = empleado.Num_emp;

        `, async function (err, results) {
            console.log(results)
            if (results.length > 0) {
                results.forEach(row => {
                    worksheet.addRow({
                        N_Inv: row.N_Inventario,
                        Eqp: row.Equipo,
                        Marca: row.Marca,
                        Modelo: row.Modelo,
                        NS: row.Num_Serie,
                        Hardware: row.Hardware,
                        Software: row.Software,
                        Monitor: row.Monitor,
                        Mouse: row.Mouse,
                        Teclado: row.Teclado,
                        Acces: row.Accesorio,
                        Encargado: row.Nom
                    });
                });

                applyHeaderStyle(worksheet);

                // Configura la respuesta para enviar el archivo
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=Equipo-${nombreArchivo}_${contador}.xlsx`);
                res.setHeader('X-Filename', `Equipo-${nombreArchivo}_${contador}.xlsx`); // Agrega el nombre del archivo al header
                contador++;

                // Envía el archivo al cliente
                await workbook.xlsx.write(res);
                res.end();
            } else {
                res.status(400).json({ type: 'error', message: 'No hay datos para generar el Excel' });
            }
        });
    } catch (err) {
        Errores(err);
        res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
    }
};

module.exports = getExcelE;
