const wsUrl = 'ws://localhost:3000';
let ws;

function connectWebSocket() {
    ws = new WebSocket(wsUrl);

    ws.onerror = (error) => {
        console.error('WebSocket Error: ', error);
    };

    ws.onclose = (event) => {
        console.log('WebSocket is closed now.', event);
        ws.onmessage = handleSocketResponse;
        connectWebSocket() // Reconnect after 1 second
    };
}