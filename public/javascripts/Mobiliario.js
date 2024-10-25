var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['MOBILIARIO']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('1') || Permisos['MOBILIARIO'].includes('3') || Permisos['MOBILIARIO'].includes('5'))) {

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
                

                // Verificamos si el permiso es '5'
                if (Permisos['MOBILIARIO'].includes('5')) {

                    const encargado = document.querySelector('.actionSelect').value;

                    formData.append('encargado', encargado);
                    formData.append('user', null);

                } else {

                    formData.append('encargado', null);
                    formData.append('user', user);

                }

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
                const image = $('.furniture-image');

                image.css('cursor', 'pointer');
                image.attr('src', "/images/add-image.png");

                // Verificamos si el permiso es '5'
                if (Permisos['MOBILIARIO'].includes('5')) {
                    // Seleccionamos el div donde queremos añadir el select y label
                    const buttonsDiv = document.querySelector('.empleado');

                    // Verificamos si ya existe el label y select para evitar duplicados
                    if (!document.querySelector('#actionSelect') && !document.querySelector('label[for="actionSelect"]')) {
                        // Definimos el HTML del label y select
                        const selectHTML = `
                    <label for="actionSelect">Selecciona un empleado:</label>
                    <select id="actionSelect" name="actionSelect" class="actionSelect">
                        <option value="">Cargando empleados...</option> 
                    </select>`;

                        // Añadimos el label y select dentro del div de botones
                        buttonsDiv.insertAdjacentHTML('beforeend', selectHTML);

                        // Referencia al select que acabamos de añadir
                        const employSelect = document.querySelector('#actionSelect');

                        // Hacer el fetch para obtener la lista de empleados
                        fetch('/responsiva/getEmploys', {
                            method: 'GET'
                        })
                            .then(response => response.json())
                            .then(data => {
                                // Limpiamos el select antes de agregar las nuevas opciones
                                employSelect.innerHTML = '<option value="">Selecciona un empleado</option>';

                                // Añadimos los empleados como opciones al select
                                data.forEach(item => {
                                    const option = document.createElement('option');
                                    option.value = item.employee;
                                    option.textContent = item.employee;
                                    employSelect.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error en la solicitud:', error);
                                showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
                            });

                        // Evento para manejar el cambio de opción en el select
                        employSelect.addEventListener('change', function (e) {
                            const selectedOption = e.target.value;
                            console.log('Empleado seleccionado:', selectedOption);
                            // Aquí puedes agregar la lógica según la opción seleccionada
                        });
                    }
                }

                // Habilitar inputs
                inputP.attr("disabled", false);

                // Agregar botones de Guardar y Cancelar
                var add = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="addImage(event)" class="Modify">`;
                var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear(); dissapearImage();" name="Cancel" class="Cancel">';

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
            formData.append('Narticulo', document.querySelector('.Fname').value)
            formData.append('Ndescripcion', document.querySelector('.DescM').value)
            formData.append('user', user);
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
                    if (data1.type === 'RespDelMob') {

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
            formData.append('user', user)

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
            var nombre_Articulo = $('.Fname').val();
            var desc_Articulo = $('.DescM').val();
            const image = $('.furniture-image')

            image.css('cursor', 'pointer')

            const inputE = $('.EditData');
            inputE.attr("disabled", false);

            var modify = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="modify('${nombre_Articulo}', '${desc_Articulo}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="Cancel" onclick="dissapear(); dissapearImage();" name="Cancel" class="Cancel">';

            editsFunctions(modify, cancel)

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
                            formData.append('user', user);

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
                        formData.append('user', user);

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
    }
}
