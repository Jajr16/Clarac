var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/productos_exist" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {

        // Consulta de productos
        fetch('/prod_exists', {
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
                        <td><i class="fa-solid fa-circle-minus" style="font-size: 25px;"></i></td>`;

                    var add = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="addProduct(event)" class="Modify">`;
                    var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear()" name="Cancel" class="Cancel">';

                    addFunctions(add, cancel);

                    tr.addEventListener('click', () => {

                        $('.Pname').val(item.Articulo);

                    });

                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });

        // Funcion para agregar productos existentes
        function addProductExist(e) {

            e.preventDefault()

            const addData = {

                Articulo: document.querySelector('.Pname').value,
                Existencia: document.querySelector('.ExistenciaP').value,
            };

            if (!checkEmptyFields(addData)) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    text: 'Debes llenar todos los datos para continuar.',
                })
            } else {

                fetch('/producto/new_prod', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addData)
                }).then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
                            showSuccessAlertReload(data.message)
                        } else {
                            showErrorAlert(data.message)
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                    });
            }
        }

        // Botón para añadir productos existentes
        $(document).on('click', '.fa-circle-plus', function (e) {
            console.log('Botón clickeado'); // Verificar si el evento se dispara

            // Cambiar la visibilidad del elemento '#agregar_prod'
            const agregar = $('#agregar_prod');
            agregar.css({
                'display': 'block',  // Hacerlo visible
                'visibility': 'visible',
                'opacity': '1'
            });

            // Cambiar la visibilidad del elemento '#sacar_prod'
            const sacar = $('#sacar_prod');
            sacar.css({
                'display': 'none',  // Hacerlo invisible
            });

        });

        // Botón para sacar productos existentes
        $(document).on('click', '.fa-circle-minus', function (e) {
            console.log('Botón clickeado'); // Verificar si el evento se dispara

            // Cambiar la visibilidad del elemento '#sacar_prod'
            const sacar = $('#sacar_prod');
            sacar.css({
                'display': 'block',  // Hacerlo visible
                'visibility': 'visible',
                'opacity': '1'
            });

            // Cambiar la visibilidad del elemento '#agregar_prod'
            const agregar = $('#agregar_prod');
            agregar.css({
                'display': 'none',  // Hacerlo invisible
            });

        });

        // Definir la función `dissapear` globalmente para que esté disponible cuando se haga clic en el botón Cancelar
        function dissapear() {
            const agregar = $('#agregar_prod');
            const sacar = $('#sacar_prod');

            // Cambiar el display a none para ocultar el contenedor
            agregar.css('display', 'none');
            sacar.css('display', 'none');
        }
    }
}