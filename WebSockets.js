const WebSocket = require('ws');

// Constante del login
const login = require('./bin/login')

// * Constantes para mobiliario * //
const consulmob = require('./bin/Mobiliario')
const modifyMob = require('./bin/MobiliarioModify')
const addFurniture = require('./bin/AddMobiliario')

// * Constantes para productos * //
const consulprod = require('./bin/Productos')
const modifyprod = require('./bin/ProductosModify')
const addProduct = require('./bin/AddProductos')

// * Constantes para equipos * //
const consuleqp = require('./bin/Equipos')
const modifyeqp = require('./bin/EquiposModify')
const addEqp = require('./bin/AddEquipos')

const Excel = require('exceljs');
const path = require('path');
const { MongoClient, GridFSBucket } = require('mongodb');
const url = 'mongodb://localhost:27017/'
const dbName = 'Clarac'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

function configureWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('WebSocket conectado')
        ws.on('message', (message) => {
            console.log(message)
            try {
                const data = JSON.parse(message)
                if (data.type === 'Log') {
                    login(ws, data)
                } else if (data.type === 'Consul_Mobiliario') {
                    consulmob(ws, data)
                } else if (data.type === 'Cambios_Mobiliario') {
                    modifyMob(wss, data)
                } else if (data.type === 'Altas_Mobiliario') {
                    addFurniture(wss, data)
                } else if (data.type === 'Guardar_Imagen') {
                    console.log('ASDa')
                    client.connect().then(() => {
                        console.log('Connected to MongoDB');
                        const db = client.db(dbName);
                        const { imagenBase64, articulo, descripcion, empleado, contentType } = data;
                        const buffer = Buffer.from(imagenBase64, 'base64');
                        const bucket = new GridFSBucket(db, {
                            bucketName: 'images'
                        });

                        const uploadStream = bucket.openUploadStream(articulo, {
                            metadata: {
                                articulo: articulo,
                                descripcion: descripcion,
                                empleado: empleado,
                                contentType: contentType // Guardar el tipo de contenido
                            }
                        });

                        uploadStream.end(buffer, async (err, file) => {
                            if (err) {
                                console.error('Error uploading file to GridFS', err);
                                ws.send(JSON.stringify({
                                    type: 'Error_Mobiliario_Respuesta',
                                    message: 'Error al guardar la imagen en la base de datos.'
                                }));
                                return;
                            }

                            ws.send(JSON.stringify({
                                type: 'Mobiliario_Respuesta',
                                message: 'Imagen guardada exitosamente.'
                            }));
                        });
                    }).catch(err => {
                        console.error('Error connecting to MongoDB', err);
                    });

                } else if (data.type === 'Obtener_Imagen') {
                    client.connect().then(() => {
                        console.log('Connected to MongoDB');
                        const db = client.db(dbName);
                        const { articulo } = data;
                        const bucket = new GridFSBucket(db, {
                            bucketName: 'images'
                        });

                        const downloadStream = bucket.openDownloadStreamByName(articulo);
                        let data1 = [];

                        downloadStream.on('data', (chunk) => {
                            data1.push(chunk);
                        });

                        downloadStream.on('end', () => {
                            const buffer = Buffer.concat(data1);
                            const base64Image = buffer.toString('base64');

                            // Obtener metadatos para incluir el tipo de contenido
                            try {
                                console.log('El articulo es ' + articulo)
                                bucket.find({ filename: articulo }).toArray((err, files) => {
                                    console.log('asdasd')
                                    if (err) {
                                        console.error('Error retrieving file metadata', err);
                                        ws.send(JSON.stringify({
                                            type: 'Error_Mobiliario_Respuesta',
                                            message: 'Error al obtener los metadatos del archivo.'
                                        }));
                                        return;
                                    }

                                    if (!files || files.length === 0) {
                                        console.error('No se encontró el archivo en GridFS');
                                        ws.send(JSON.stringify({
                                            type: 'Error_Mobiliario_Respuesta',
                                            message: 'No se encontró el archivo en la base de datos.'
                                        }));
                                        return;
                                    } else {
                                        console.log('No pss mamo')
                                    }

                                    const contentType = files[0].metadata.contentType;
                                    console.log('Metadatos del archivo encontrados:', contentType);

                                    ws.send(JSON.stringify({
                                        type: 'Imagen_Obtenida',
                                        imagenBase64: base64Image,
                                        articulo: articulo,
                                        contentType: contentType // Incluir el tipo de contenido
                                    }));
                                });
                            } catch (error) {
                                console.error('Error en la operación de búsqueda en GridFS:', error);
                                ws.send(JSON.stringify({
                                    type: 'Error_Mobiliario_Respuesta',
                                    message: 'Error en la operación de búsqueda en GridFS.'
                                }));
                            }
                        });

                        downloadStream.on('error', (err) => {
                            console.error('Error downloading image from GridFS', err);
                            ws.send(JSON.stringify({
                                type: 'Error_Mobiliario_Respuesta',
                                message: 'Error al obtener la imagen de la base de datos.'
                            }));
                        });
                    }).catch(err => {
                        console.error('Error connecting to MongoDB', err);
                    });
                } else if (data.type === 'Consul_Productos') {
                    consulprod(ws, data)
                } else if (data.type === 'Cambios_Productos') {
                    modifyprod(wss, data)
                } else if (data.type === 'Altas_Productos') {
                    addProduct(wss, data)
                } else if (data.type === 'Consul_Equipos') {
                    consuleqp(ws, data)
                } else if (data.type === 'Cambios_Equipos') {
                    modifyeqp(wss, data)
                } else if (data.type === 'Altas_Equipos') {
                    addEqp(wss, data)
                }
            } catch (error) {
                console.error(error)
            }
        })
    });

    wss.on('close', (event) => {
        console.log('WebSocket cerrado', event);
    });

    wss.on('error', (error) => {
        console.error('Error en WebSocket', error);
    });

}

module.exports = configureWebSocket;