var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulProd" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {

        if (Permisos['ALMACÉN'].includes('1')) {
            function addProduct(e) {

                e.preventDefault()

                const addData = {

                    Cod_Barras: document.querySelector('.CodBarrasP').value,
                    Categoria: document.querySelector('.CateP').value,
                    Articulo: document.querySelector('.Pname').value,
                    Marca: document.querySelector('.MarcaP').value,
                    Descripcion: document.querySelector('.DescP').value,
                    Unidad: document.querySelector('.UnidadP').value,
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
        }

        // Botón para añadir
        document.addEventListener('DOMContentLoaded', function () {

            const addP = $('.fa-circle-plus')

            const selectCat = $('.CateP')
            const selectUM = $('.UnidadP')

            selectCat.append($('<option>', { disabled: true, selected: true }))
            selectCat.append($('<option>', { value: 'PAPELERÍA', text: 'PAPELERÍA' }))
            selectCat.append($('<option>', { value: 'LIMPIEZA', text: 'LIMPIEZA' }))
            selectCat.append($('<option>', { value: 'FERRETERÍA', text: 'FERRETERÍA' }))

            selectUM.append($('<option>', { disabled: true, selected: true }))
            selectUM.append($('<option>', { value: 'UNIDAD', text: 'UNIDAD' }))
            selectUM.append($('<option>', { value: 'LITROS', text: 'LITROS' }))
            selectUM.append($('<option>', { value: 'KILOS', text: 'KILOS' }))
            selectUM.append($('<option>', { value: 'METROS', text: 'METROS' }))

            if (Permisos['ALMACÉN'].includes('1')) {
                addP.click(function (e) {

                    selectCat.removeAttr('disabled');
                    selectUM.removeAttr('disabled');

                    var add = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="addProduct(event)" class="Modify">`;
                    var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear()" name="Cancel" class="Cancel">';

                    addFunctions(add, cancel, 'Ingresa los datos del producto')
                })
            }

            if (Permisos['ALMACÉN'].includes('3')) {
                function modify(oldCodBarras, e) {
                    console.log('Si entras')
                    e.preventDefault()
                    const updatedData = {
                        Cod_Barras: document.querySelector('.CodBarrasP').value,
                        Categoria: document.querySelector('.CateP').value,
                        Articulo: document.querySelector('.Pname').value,
                        Marca: document.querySelector('.MarcaP').value,
                        Descripcion: document.querySelector('.DescP').value,
                        Unidad: document.querySelector('.UnidadP').value,
                        dataOldCB: oldCodBarras,
                        User: user
                    };

                    fetch('/producto/mod_prod', {
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
                const edit = $('.edit');

                edit.click(function (e) {
                    console.log('Tmb entras')
                    var Cod_Barras = $('.CodBarrasP').val();

                    var modify = `<input type="submit" value="Guardar" id="modyProd" name="modyProd" onclick="modify('${Cod_Barras}', event)" class="Modify">`;
                    var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear()" name="Cancel" class="Cancel">';

                    editsFunctions(modify, cancel)
                });
            }
        });

        window.addEventListener("load", function (event) {
            fetch('/producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: user })
            }).then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector(".data-prod tbody");
                    const selProd = $('.Prod')

                    if (data.length <= 0) {
                        empty_table()
                    }

                    data.forEach(item => {

                        let tr = document.createElement('tr');

                        if (item.Eliminado !== 1) {
                            selProd.append($('<option>', { value: item.Articulo, text: item.Articulo }))


                            tr.innerHTML = `
                            <td>${item.Cod_Barras}</td>
                            <td>${item.Articulo}</td>
            `;

                            $('.Prod').change(function () {
                                if ($(this).val() === item.Articulo) {
                                    iconsLogic();
                                    $('.CodBarrasP').val(item.Cod_Barras);
                                    $('.CateP').val(item.Categoria);
                                    $('.Pname').val(item.Articulo);
                                    $('.MarcaP').val(item.Marca);
                                    $('.DescP').val(item.Descripcion);
                                    $('.UnidadP').val(item.Unidad);
                                }
                            });

                            tr.addEventListener('click', () => {
                                iconsLogic()

                                $('.CodBarrasP').val(item.Cod_Barras);
                                $('.CateP').val(item.Categoria);
                                $('.Pname').val(item.Articulo);
                                $('.MarcaP').val(item.Marca);
                                $('.DescP').val(item.Descripcion);
                                $('.UnidadP').val(item.Unidad);
                            });
                        }

                        tbody.appendChild(tr);
                    });
                    sselect()
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                });
            if (Permisos['ALMACÉN'].includes('2')) {
                const trash = $('.trash')
                trash.click(function (e) {
                    var CB = $('.CodBarrasP').val()

                    if (CB !== '') {
                        const formData = new FormData()
                        formData.append('Cod_Barras', CB)

                        fetch('/producto/del_prod', {
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
            }

            const excel = $('.excel-icon')

            if (excel.length > 0) {
                excel.click(function (e) {
                    Excels('ExcelA')
                })
            }

        })

    }
}