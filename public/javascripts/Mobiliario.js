var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');
var nom = localStorage.getItem('nombre')

if (!Permisos['MOBILIARIO']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('1') || Permisos['MOBILIARIO'].includes('3') || Permisos['MOBILIARIO'].includes('5'))) {

        function identificate(name) {
            let nombre = ''
            if (nom == name) {
                nombre = user;
            } else {
                nombre = name
            }
            return nombre
        }

        function agregarEncargadoOUsuario(formData, Permisos, user) {
            // Verificamos si el permiso es '5'
            if (Permisos['MOBILIARIO'].includes('5')) {
                const encargado = document.querySelector('.actionSelect').value;
                formData.append('encargado', encargado);
            } else {
                formData.append('user', user);
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            const fileInput = document.querySelector('.fileInput');
            const imagePreview = document.querySelector('.furniture-image');

            // Manejar el cambio en el input de archivo
            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];

                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block'; // Mostrar la imagen seleccionada
                    };

                    reader.readAsDataURL(file);
                } else {
                    fileInput.value = '';
                    imagePreview.src = '/images/add-image.png';

                    Swal.fire({
                        icon: "error",
                        title: "Ocurrió un error",
                        text: 'Por favor, selecciona un archivo que sea una imagen.',
                    })
                }
            });
        });

        function addImage(e) {
            e.preventDefault()

            const inputFile = document.getElementById('file');
            const articulo = document.querySelector('.Fname').value;
            const descripcion = document.querySelector('.DescM').value;
            const cantidad = document.querySelector('.CantidadM').value;
            const ubicacion = document.querySelector('.UbiM').value;

            if (articulo === '' || descripcion === '' || cantidad === '' || ubicacion === '') {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    text: 'Debes llenar todos los datos para continuar.',
                })
            } else if (!inputFile.files || !inputFile.files[0]) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    text: 'Sube una imagen del mobiliario para poder continuar.',
                })
            } else {

                const formData = new FormData();
                formData.append('articulo', articulo);
                formData.append('descripcion', descripcion);
                formData.append('Cantidad', cantidad);
                formData.append('Ubicacion', ubicacion);

                // Agregar encargado o usuario
                agregarEncargadoOUsuario(formData, Permisos, user);

                fetch('/mobiliario/users/check-filename', {
                    method: 'POST',
                    body: formData  // Enviar el FormData sin especificar el Content-Type
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
                            formData.append('file', inputFile.files[0]);
                            return fetch('/mobiliario/users/upload', {
                                method: 'POST',
                                body: formData  // Enviar el FormData sin especificar el Content-Type
                            });
                        } else {
                            console.log('Todo mal');
                            showErrorAlert(data.message);
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
                            showSuccessAlertReload(data.message);
                        } else {
                            showErrorAlert(data.message);
                        }
                    }).catch(error => {
                        console.error('Error en la solicitud:', error);
                        // showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                    })
            }
        }

        var ImageFunction = function () {
            const inputFile = document.getElementById('file');
            inputFile.click();
        }

        // Añadir mobiliario
        document.addEventListener('DOMContentLoaded', function () {

            const addF = $('.fa-circle-plus');
            const inputP = $('.EditData');

            addF.click(function (e) {

                removeEmpM(); // Llamada a la función
                const image = $('.furniture-image');

                image.css('cursor', 'pointer');
                image.attr('src', "/images/add-image.png");

                window.insertSelectForEmployees();

                // Habilitar inputs
                inputP.attr("disabled", false);

                // Agregar botones de Guardar y Cancelar
                var add = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="addImage(event)" class="Modify">`;
                var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear(); cancel(); dissapearImage();" name="Cancel" class="Cancel">';

                addFunctions(add, cancel, 'Ingresa los datos del mobiliario');

                // Hacer que la imagen sea clickeable
                const imagen = document.getElementsByClassName('furniture-image')[0];
                imagen.addEventListener('click', ImageFunction);
            });

            // Función para manejar el botón "Cancelar"
            window.dissapear = function () {
                // Volver a deshabilitar el input
                inputP.attr("disabled", true);
            
                // Mostrar el botón "fa-circle-plus" de nuevo
                addF.show();
            
                // Eliminar los botones "Guardar" y "Cancelar"
                $('.Modify').remove();
                $('.Cancel').remove();
            
                // Eliminar el select y su label si existen
                const select = document.querySelector('#actionSelect');
                const label = document.querySelector('label[for="actionSelect"]');
                if (select) {
                    select.remove();
                }
                if (label) {
                    label.remove();
                }
            
                // Ocultar los botones "edit" y "trash"
                $('.edit').hide();
                $('.trash').hide();
            
                // Mostrar otros elementos ocultos, si es necesario
                $('.editE').css('display', 'inline');
            };
            
        });

        function dissapearImage() {
            const imagen = document.getElementsByClassName('furniture-image')[0];

            document.querySelector('.furniture-image').src = "/images/add-image.png"

            imagen.removeEventListener('click', ImageFunction);
            imagen.style.cursor = 'default';
        }

        function modify(oldName, oldDesc, e) {
            e.preventDefault()

            const formData = new FormData();
            formData.append('Narticulo', document.querySelector('.Fname').value);
            formData.append('Ndescripcion', document.querySelector('.DescM').value);

            // Agregar encargado o usuario
            agregarEncargadoOUsuario(formData, Permisos, user);

            formData.append('cantidad', document.querySelector('.CantidadM').value);
            formData.append('ubicacion', document.querySelector('.UbiM').value);
            formData.append('articulo', oldName);
            formData.append('descripcion', oldDesc);

            console.log(formData)
            fetch('/mobiliario/mod_mob', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data1 => {
                    if (data1.type === 'success') {

                        const inputFile = document.getElementById('file');

                        if (!inputFile.files[0] || !inputFile.files || (inputFile.files.length === 0)) {
                            fetch('/mobiliario/renameImage', {
                                method: 'POST',
                                body: formData
                            }).then(response => response.json())
                                .then(data => {
                                    if (data.type === 'success') {
                                        showSuccessAlertReload(data1.message)
                                        console.log(data.message)
                                    } else {
                                        showErrorAlert(data.message)
                                    }
                                })
                                .catch(error => {
                                    console.error('Error en la solicitud:', error);
                                    showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                                });
                        } else {
                            formData.append('file', inputFile.files[0])

                            fetch('/mobiliario/renew', {
                                method: 'POST',
                                body: formData
                            }).then(response => response.json())
                                .then(data => {
                                    if (data.type === 'success') {
                                        showSuccessAlertReload(data1.message)
                                        console.log(data.message)
                                    } else {
                                        showErrorAlert(data.message)
                                    }
                                })
                                .catch(error => {
                                    console.error('Error en la solicitud:', error);
                                    showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                                });
                        }

                    } else {
                        showErrorAlert(data1.message)
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                });
        }

        // FUNCIONALIDAD PÁGINA
        const trash = $('.trash')
        trash.click(function (e) {

            var nombre_Articulo = $('.Fname').val();
            var desc_Articulo = $('.DescM').val();

            var formData = new FormData()
            formData.append('articulo', nombre_Articulo)
            formData.append('descripcion', desc_Articulo)

            // Agregar encargado o usuario
            agregarEncargadoOUsuario(formData, Permisos, user);

            if (nombre_Articulo !== '' && desc_Articulo !== '') {
                fetch('/mobiliario/delMob', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
                            showSuccessAlertReload(data.message)
                        } else {
                            showErrorAlert(data.message)
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                    });
            }
        })

        const edit = $('.edit');
        edit.click(function (e) {

            const nombre_Articulo = $('.Fname').val();
            const desc_Articulo = $('.DescM').val();
            const empleado = $('.EmpM').val(); // Obtener el nombre del empleado
            removeEmpM(); // Llamada a la función

            const image = $('.furniture-image');
            image.css('cursor', 'pointer');

            const inputE = $('.EditData');
            inputE.attr("disabled", false);

            // Llama a la función insertSelectForEmployees con el nombre del empleado
            window.insertSelectForEmployees(empleado);

            var modify = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="modify('${nombre_Articulo}', '${desc_Articulo}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear(); dissapearImage();" name="Cancel" class="Cancel">';

            editsFunctions(modify, cancel);

            const imagen = document.getElementsByClassName('furniture-image')[0];
            imagen.addEventListener('click', ImageFunction);

        });



        fetch('/mobiliario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                const tbody = document.querySelector(".data-mob tbody");
                const selMob = $('.Mob')

                if (data.length <= 0) {
                    empty_table()
                }

                data.forEach(item => {
                    selMob.append($('<option>', { value: item.Articulo, text: item.Articulo }))

                    let tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${item.Articulo}</td>
            <td>${item.Cantidad}</td>
        `;

                    $('.Mob').change(function () {
                        if ($(this).val() === item.Articulo) {
                            iconsLogic()

                            const formData = new FormData();
                            formData.append('articulo', item.Articulo)
                            formData.append('descripcion', item.Descripcion)

                            formData.append('user', identificate(item.Nombre))

                            fetch('/mobiliario/users/disp_image', {
                                method: 'POST',
                                body: formData
                            }).then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.blob();
                            }).then(blob => {
                                const url = URL.createObjectURL(blob); // Crear URL del blob
                                document.querySelector('.furniture-image').src = url;
                                $('.Fname').val(item.Articulo);
                                $('.UbiM').val(item.Ubicacion);
                                $('.CantidadM').val(item.Cantidad);
                                $('.DescM').val(item.Descripcion);
                            }).catch(error => {
                                console.error('Error en la solicitud:', error);
                            });
                        }
                    })

                    tr.addEventListener('click', () => {
                        iconsLogic()

                        const formData = new FormData();
                        formData.append('articulo', item.Articulo)
                        formData.append('descripcion', item.Descripcion)

                        formData.append('user', identificate(item.Nombre))

                        fetch('/mobiliario/users/disp_image', {
                            method: 'POST',
                            body: formData
                        }).then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.blob();
                        }).then(blob => {
                            const url = URL.createObjectURL(blob); // Crear URL del blob
                            document.querySelector('.furniture-image').src = url;
                            $('.Fname').val(item.Articulo);

                            if (Permisos['MOBILIARIO'].includes('5')) {
                                const targetDiv = document.querySelector('.DF');
                                if (!document.querySelector('#EmpM') && !document.querySelector('label[for="EmpM"]')) {
                                    const divHTML = `
                                        <div class="DF">
                                            <label>Encargado:</label>
                                            <input autocomplete="off" type="text" id="EmpM" name="EmpM" class="EmpM EditData" required
                                                maxlength="400" oninput="mayus(this);" onkeypress="return checkA(event)" readonly>
                                        </div>`;
                                    targetDiv.insertAdjacentHTML('beforebegin', divHTML);
                                }

                                $('.EmpM').val(item.Nombre);
                            }

                            $('.UbiM').val(item.Ubicacion);
                            $('.CantidadM').val(item.Cantidad);
                            $('.DescM').val(item.Descripcion);
                        }).catch(error => {
                            console.error('Error en la solicitud:', error);
                        });


                    });
                    tbody.appendChild(tr);
                });
                sselect()
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
            });

        const excel = $('.excel-icon')

        if (excel.length > 0) {
            excel.click(function (e) {
                Excels('ExcelM')
            })
        }

        function removeEmpM() {
            const empMDiv = document.querySelector('.DF > input#EmpM')?.parentElement;
            if (empMDiv) {
                empMDiv.remove();
            }
        }

    }
}
