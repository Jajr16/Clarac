const WebSocket = require('ws');
const login = require('./bin/login')
const consulmob = require('./bin/Mobiliario')
const modifyMob = require('./bin/MobiliarioModify')
const addFurniture = require('./bin/AddMobiliario')
const guardarImagenEnBD = require('./bin/images');
const obtenerImagen = require('./bin/obtenerImagen');
const Excel = require('exceljs');
const path = require('path');

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
                } else if (data.type === 'Guardar_Imagen') {
                    guardarImagenEnBD(wss, data);
                } else if (data.type === 'Altas_Mobiliario') {
                    addFurniture(wss, data)
                } else if (data.type === 'Obtener_Imagen') {
                    obtenerImagen(ws, data);
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