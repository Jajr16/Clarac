var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');
const Excel = require('exceljs');
let nombreArchivo = require('./dates')

var contador = 1;

async function getExcelRPS(res) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");

    worksheet.columns = [
        { header: 'Código de Barras', key: 'CB', width: 25 },
        { header: 'Producto', key: 'NomAr', width: 18 },
        { header: 'Encargado', key: 'NE', width: 30 },
        { header: 'Cantidad de salida', key: 'CS', width: 25 },
        { header: 'Fecha de salida', key: 'FS', width: 30 }
    ];

    try {
        db.query('SELECT sp.*, a.Articulo, e.Nom AS Nombre_Empleado FROM salidas_productos sp JOIN almacen a ON sp.Cod_BarrasS = a.Cod_Barras JOIN empleado e ON sp.Num_EmpS = e.Num_Emp;', async function (err, result) {
            if (result.length > 0) {
                result.forEach(row => {
                    const addedRow = worksheet.addRow({
                        CB: row.Cod_BarrasS,
                        NomAr: row.Articulo,
                        NE: row.Nombre_Empleado,
                        CS: row.Cantidad_Salida,
                        FS: row.FSalida
                    });

                    addedRow.eachCell((cell) => {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFF' }
                        };
                    });

                });

                // Estilo del Excel
                ['A1', 'B1', 'C1', 'D1', 'E1'].forEach(cell => {
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
                });

                worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.autoFilter = 'A:E';

                // Configura la respuesta para enviar el archivo
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=Almacen-${nombreArchivo}_${contador}.xlsx`);
                res.setHeader('X-Filename', `Registro-Productos-Sacados-${nombreArchivo}_${contador}.xlsx`); // Agrega el nombre del archivo al header
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
}

module.exports = getExcelRPS;