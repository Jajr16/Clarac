var db = require("../Conexion/BaseDatos"); // Importar la conexión a la base de datos
var Errores = require('./Error');
const Excel = require('exceljs');
let nombreArchivo = require('./dates')

var contador = 1;

async function getExcelA(res) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("My Sheet");

    worksheet.columns = [
        { header: 'Código de Barras', key: 'CB', width: 25 },
        { header: 'Categoría', key: 'Cat', width: 18 },
        { header: 'Nombre del Artículo', key: 'NomAr', width: 30 },
        { header: 'Marca del Artículo', key: 'MarcArt', width: 25 },
        { header: 'Descripción', key: 'Desc', width: 30 },
        { header: 'Unidad', key: 'Uni', width: 15 },
        { header: 'En existencia', key: 'Exist', width: 20 },
        { header: 'Eliminado', key: 'Eliminado', width: 15 }
    ];

    try {
        db.query('SELECT * FROM almacen ORDER BY eliminado', async function (err, result) {
            if (result.length > 0) {
                result.forEach(row => {
                    const addedRow = worksheet.addRow({
                        CB: row.Cod_Barras,
                        Cat: row.Categoria,
                        NomAr: row.Articulo,
                        MarcArt: row.Marca,
                        Desc: row.Descripcion,
                        Uni: row.Unidad,
                        Exist: row.Existencia,
                        Eliminado: row.eliminado  ? 'Sí' : 'No'
                    });
                    
                    if (row.eliminado) {
                        addedRow.eachCell((cell) => {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFF0000' }
                            };
                        });
                    }

                });

                // Estilo del Excel
                ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1'].forEach(cell => {
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
                worksheet.autoFilter = 'A:G';

                // Configura la respuesta para enviar el archivo
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=Almacen-${nombreArchivo}_${contador}.xlsx`);
                res.setHeader('X-Filename', `Almacen-${nombreArchivo}_${contador}.xlsx`); // Agrega el nombre del archivo al header
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

module.exports = getExcelA;