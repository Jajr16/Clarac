var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulProd" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {

        function addProduct(e) {

            e.preventDefault()

            const addData = {

                Cod_Barras: document.querySelector('.CodBarrasP').value,
                Categoria: document.querySelector('.CateP').value,
                Articulo: document.querySelector('.Pname').value,
                Marca: document.querySelector('.MarcaP').value,
                Descripcion: document.querySelector('.DescP').value,
                Unidad: document.querySelector('.UnidadP').value,
                Existencia: document.querySelector('.ExistenciaP').value,
            };

            fetch('/new_prod', {
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

        // Botón para añadir
        document.addEventListener('DOMContentLoaded', function () {
            const addP = $('.fa-circle-plus')
            addP.click(function (e) {
                const inputP = $('.EditData');

                inputP.attr("readonly", false);
                inputP.attr("placeholder", 'Ingresa los datos del producto');
                inputP.val('')

                var add = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="addProduct(event)" class="Modify">`;
                var cancel = '<input type="submit" value="Cancelar" id="cancelProd" onclick="dissapear()" name="cancelProd" class="Cancel">';
                $('.Modify').remove();
                $('.Cancel').remove();
                $('.buttons').append(add);
                $('.buttons').append(cancel);

                const edit = $('.editP');
                edit.css('display', 'none')
            })

        });

        function modify(oldCodBarras, e) {

            e.preventDefault()
            const updatedData = {
                Cod_Barras: document.querySelector('.CodBarrasP').value,
                Categoria: document.querySelector('.CateP').value,
                Articulo: document.querySelector('.Pname').value,
                Marca: document.querySelector('.MarcaP').value,
                Descripcion: document.querySelector('.DescP').value,
                Unidad: document.querySelector('.UnidadP').value,
                Existencia: document.querySelector('.ExistenciaP').value,
                dataOldCB: oldCodBarras,
                User: user
            };

            fetch('/mod_prod', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            }).then(response => response.json())
                .then(data => {
                    if (data.type === 'RespDelProd') {
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

        // Borrar producto
        const trash = $('.trash')
        trash.click(function (e) {
            var CB = $('.CodBarrasP').val()

            if (CB !== '') {
                const formData = new FormData()
                formData.append('Cod_Barras', CB)

                fetch('/del_prod', {
                    method: 'POST',
                    body: formData
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
        })

        // FUNCIONALIDAD PÁGINA
        const edit = $('.edit');

        edit.click(function (e) {

            var Cod_Barras = $('.CodBarrasP').val();

            const inputP = $('.EditData');
            inputP.attr("readonly", false);
            var modify = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="modify('${Cod_Barras}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelProd" onclick="dissapear()" name="cancelProd" class="Cancel">';
            $('.Modify').remove();
            $('.Cancel').remove();
            $('.fa-circle-plus').css('display', 'none')
            $('.buttons').append(modify);
            $('.buttons').append(cancel);
        });

        fetch('/Productos', {
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
            <td>${item.Existencia}</td>
        `;
                    tr.addEventListener('click', () => {
                        iconsLogic()

                        $('.CodBarrasP').val(item.Cod_Barras);
                        $('.CateP').val(item.Categoria);
                        $('.Pname').val(item.Articulo);
                        $('.MarcaP').val(item.Marca);
                        $('.DescP').val(item.Descripcion);
                        $('.UnidadP').val(item.Unidad);
                        $('.ExistenciaP').val(item.Existencia);

                    });
                    if (item.Eliminado !== 1) { }
                    
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });

    }
}