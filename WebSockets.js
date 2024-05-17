const WebSocket = require('ws');
const login = require('./bin/login')
const consulmob = require('./bin/Mobiliario')
const Excel = require('exceljs');  // Importar la librería para trabajar con archivos Excel
const path = require('path');   // Importar el módulo 'path' de Node.js para trabajar con rutas de archivos

function configureWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('WebSocket conectado')
        ws.on('message', (message) => {
            console.log(message)
            try {
                const data = JSON.parse(message)
                if(data.type === 'Log'){
                    login(ws, data)
                } else if (data.type === 'Consul_Mobiliario') {
                    consulmob(ws, data)
                }
            } catch (error) {
                console.error(error)
            }
        })
    });
}

module.exports = configureWebSocket;