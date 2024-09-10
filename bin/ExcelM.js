const db = require("../Conexion/BaseDatos");
const Errores = require('./Error');
const Excel = require('exceljs');
const nombreArchivo = require('./dates');

let contador = 1;

const createWorksheet = (workbook) => {
    const worksheet = workbook.addWorksheet("My Sheet");

    worksheet.columns = [
        { header: 'N. Inv', key: 'N_Inv', width: 11 },
        { header: 'Artículo', key: 'Arti', width: 50 },
        { header: 'Descripción', key: 'Desc', width: 50 },
        { header: 'Ubicación', key: 'Ubi', width: 40 },
        { header: 'Cantidad', key: 'Cant', width: 15 },
        // { header: 'Área', key: 'Area', width: 25 },
        { header: 'Encargado', key: 'Encargado', width: 40 }
    ];

    return worksheet;
};

const applyHeaderStyle = (worksheet) => {
    for (let i = 'A'.charCodeAt(0); i <= 'F'.charCodeAt(0); i++) {
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
    worksheet.autoFilter = 'A:F';
};

const getExcelM = async (res) => {
    const workbook = new Excel.Workbook();
    const worksheet = createWorksheet(workbook);

    try {
        db.query(`
            SELECT 
                mobiliario.Num_Inventario, mobiliario.Articulo, mobiliario.Descripcion, 
                mobiliario.Ubicacion, mobiliario.Cantidad,
                empleado.Nom
            FROM mobiliario
            INNER JOIN empleado ON mobiliario.Num_emp = empleado.Num_emp
        `, async (err, results) => {
            if (err) {
                Errores(err);
                res.status(500).json({ type: 'error', message: 'Error en el servidor', details: err });
                return;
            }

            if (results.length > 0) {
                results.forEach(row => {
                    worksheet.addRow({
                        N_Inv: row.Num_Inventario,
                        Arti: row.Articulo,
                        Desc: row.Descripcion,
                        Ubi: row.Ubicacion,
                        Cant: row.Cantidad,
                        Encargado: row.Nom
                    });
                });

                applyHeaderStyle(worksheet);

                // Configura la respuesta para enviar el archivo
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=Mobiliario-${nombreArchivo}_${contador}.xlsx`);
                res.setHeader('X-Filename', `Mobiliario-${nombreArchivo}_${contador}.xlsx`); // Agrega el nombre del archivo al header
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

module.exports = getExcelM;