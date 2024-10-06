var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/productos_exist" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {

        // Consulta de productos
        fetch('/prodExistConsul', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-prod tbody");

                data.forEach(item => {
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${item.Articulo}</td>
            <td>${item.Cod_Barras}</td>
            <td>${item.Existencia}</td>
            <td><i class="fa-solid fa-circle-plus" style="font-size: 25px;"></i></td>
            <td><i class="fa-solid fa-circle-minus" style="font-size: 25px;"></i></td>
        `;
                    tr.addEventListener('click', () => {
                        iconsLogic()

                        $('.CodBarrasP').val(item.Cod_Barras);
                        $('.Pname').val(item.Articulo);
                        $('.ExistenciaP').val(item.Existencia);

                    });

                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });


        // Lógica para incrementar existencia al hacer clic en "fa-circle-plus"
        document.querySelectorAll('.fa-circle-plus').forEach(plusIcon => {
            plusIcon.addEventListener('click', function () {
                // Encuentra la fila del producto correspondiente
                const row = this.closest('tr');
                const existenciaCell = row.querySelector('.ExistenciaP');
                let existencia = parseInt(existenciaCell.textContent);

                // Incrementa la existencia
                existencia += 1;
                existenciaCell.textContent = existencia;

                // Enviar solicitud al servidor (si es necesario) para actualizar la existencia
                const codigoBarras = row.querySelector('td:nth-child(2)').textContent;

                fetch('/prodExistAdd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ codigoBarras: codigoBarras, nuevaExistencia: existencia })
                })
                    .then(response => response.json())
                    .then(result => {
                        console.log('Existencia actualizada en el servidor:', result);
                    })
                    .catch(error => {
                        console.error('Error al actualizar la existencia:', error);
                    });
            });
        });

    }
}