const ws = new WebSocket('ws://localhost:3000');

var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;

if (!Permisos['MOBILIARIO']) {
    location.href = "index";
} else {
    if (pathname == "/users/ConsulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('1') || Permisos['MOBILIARIO'].includes('3'))) {
        ws.onopen = function () {
            const data = {
                type: 'Consul_Mobiliario',
                user: localStorage.getItem('user')
            };

            ws.send(JSON.stringify(data));
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const tbody = document.querySelector(".data-mob tbody")

            let filaHTML = `
                <tr>
                    <td>${data.Articulo}</td>
                    <td>${data.Cantidad}</td>
                </tr>`;

            tbody.innerHTML += filaHTML;
        }

        ws.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        ws.onclose = (event) => {
            console.log('WebSocket is closed now.', event);
        };
    }
}