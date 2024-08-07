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
                const inputP = $('.EditDataP');
  
                inputP.attr("readonly", false);
                inputP.attr("placeholder", 'Ingresa los datos del producto');
                inputP.val('')

                var add = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="addProduct(event)" class="modyProd">`;
                var cancel = '<input type="submit" value="Cancelar" id="cancelProd" onclick="dissapear()" name="cancelProd" class="cancelProd">';
                $('.modyProd').remove();
                $('.cancelProd').remove();
                $('.buttons').append(add);
                $('.buttons').append(cancel);

                const edit = $('.editP');
                edit.css('display', 'none')
            })

        });

        function dissapear() {
            const inputP = $('.EditDataP')

            inputP.attr("placeholder", '')
            inputP.attr("readonly", true)
            $('.modyProd').remove()
            $('.cancelProd').remove()
            $('.fa-circle-plus').css('display', 'block')

            const edit = $('.editP');
            edit.css('display', 'block')
        }

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

        // FUNCIONALIDAD PÁGINA
        const edit = $('.editP');

        edit.click(function (e) {

            var Cod_Barras = $('.CodBarrasP').val();

            const inputP = $('.EditDataP');
            inputP.attr("readonly", false);
            var modify = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="modify('${Cod_Barras}', event)" class="modyProd">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelProd" onclick="dissapear()" name="cancelProd" class="cancelProd">';
            $('.modyProd').remove();
            $('.cancelProd').remove();
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
                        if ($('.fa-pencil-square-o').css('visibility', 'hidden')) {
                            $('.fa-pencil-square-o').css('visibility', 'visible');
                            const inputP = $('.EditDataP');
                            inputP.attr("readonly", true);
                            $('.modyProd').remove();
                            $('.cancelProd').remove();
                        }
                        if ($('.editP').css('display', 'none')) {
                            $('.editP').css('display', 'block')
                        }
                        if ($('.fa-circle-plus').css('display', 'none')) {
                            $('.fa-circle-plus').css('display', 'block')
                        }
                        $('.CodBarrasP').val(item.Cod_Barras);
                        $('.CateP').val(item.Categoria);
                        $('.Pname').val(item.Articulo);
                        $('.MarcaP').val(item.Marca);
                        $('.DescP').val(item.Descripcion);
                        $('.UnidadP').val(item.Unidad);
                        $('.ExistenciaP').val(item.Existencia);

                    });
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });

    }
}