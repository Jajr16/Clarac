const ws = new WebSocket('ws://localhost:3000');

var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulProd" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {
        // FUNCIONALIDAD PÁGINA
        const edit = $('.editP')
        edit.click(function (e) {
            const inputM = $('.EditDataP')
            inputM.attr("readonly", false)
            var modify = '<input type="submit" value="Guardar" id="modyProd" name="modyProd" class="modyProd">'
            var cancel = '<input type="submit" value="Cancelar" id="cancelProd" name="cancelProd" class="cancelProd">'
            $('.buttons').append(modify)
            $('.buttons').append(cancel)
        })

        // FUNCIONOALIDAD WEBSOCKETS
        ws.onopen = function () {
            const data = {
                type: 'Consul_Productos',
                user: localStorage.getItem('user')
            };

            ws.send(JSON.stringify(data));
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const tbody = document.querySelector(".data-prod tbody")

            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${data.Articulo}</td>
                <td>${data.Existencia}</td>
            `;

            tr.addEventListener('click', () => {
                if ($('.fa-pencil-square-o').css('visibility', 'hidden')) {
                    $('.fa-pencil-square-o').css('visibility', 'visible')
                    const inputM = $('.EditDataP')
                    inputM.attr("readonly", true)
                    $('.modyProd').remove()
                    $('.cancelProd').remove()
                }
                $('.CodBarras').text(data.Cod_Barras);
                $('.Categoria').text(data.Categoria);
                $('.Articulo').val(data.Articulo);
                $('.Marca').val(data.Marca);
                $('.Descripcion').text(data.Descripcion);
                $('.Unidad').text(data.Unidad);
                $('.Existencia').val(data.Existencia);
                
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