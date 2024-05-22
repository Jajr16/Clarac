const ws = new WebSocket('ws://localhost:3000');

var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;

if (!Permisos['MOBILIARIO']) {
    location.href = "index";
} else {
    if (pathname == "/users/ConsulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('1') || Permisos['MOBILIARIO'].includes('3'))) {
        // FUNCIONALIDAD PÁGINA
        const edit = $('.editM')
        edit.click(function (e) {
            const inputM = $('.EditDataM')

        })

        // FUNCIONOALIDAD WEBSOCKETS
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
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.Articulo}</td>
                <td>${data.Cantidad}</td>
            `;

            tr.addEventListener('click', () => {
                if($('.fa-pencil-square-o').css('visibility', 'hidden')){
                    $('.fa-pencil-square-o').css('visibility', 'visible')
                }
                $('.Fname').text(data.Articulo);
                $('.UbiM').text(data.Ubicacion);
                $('.CantidadM').text(data.Cantidad);
                $('.DescM').text(data.Descripcion);
            });

            tbody.appendChild(tr);
        }

        ws.onerror = (error) => {
            console.error('WebSocket Error: ', error);
        };

        ws.onclose = (event) => {
            console.log('WebSocket is closed now.', event);
        };
    }
}