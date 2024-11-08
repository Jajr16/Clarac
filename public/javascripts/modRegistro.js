var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');
let slimSelectInstances = [];

function obtenerEmpleados() {
    return new Promise((resolve, reject) => {
        fetch('/registro/getEmpleados', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la red');
                }
                return response.json();
            })
            .then(data => {
                // console.log("Datos recibidos:", data);

                const selectElement = document.getElementById('Nombre');

                // Limpiar las opciones existentes
                selectElement.innerHTML = '<option value=""></option>';

                // Verificar si los datos están en el formato correcto
                if (Array.isArray(data)) {
                    data.forEach(empleado => {
                        const option = document.createElement('option');
                        option.value = empleado;
                        option.textContent = empleado;
                        selectElement.appendChild(option);
                    });
                } else {
                    console.error("Datos recibidos no son un array:", data);
                }

                resolve();  // Resuelve la promesa una vez que los datos hayan sido procesados
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                reject(error);
            });
    });
}

function clearContent() {
    const tbody = document.querySelector(".data-prod tbody");
    const headers = document.getElementById('table-headers');
    const table = document.querySelector(".data-prod");

    headers.innerHTML = '';
    tbody.innerHTML = '';
    table.style.visibility = "hidden";

    slimSelectInstances.forEach(instance => {
        if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
        }
    });
    slimSelectInstances = [];
}

$(document).off('click', '.meter').on('click', '.meter', function (e) {
    clearContent();
    obtenerRegistrosEmpleados();
    setTimeout(sselect2, 100);
});

$(document).off('click', '.sacar').on('click', '.sacar', function (e) {
    clearContent();
    obtenerRegistrosUsuarios();
    setTimeout(sselect2, 100);
});

// Función para mostrar la tabla
function showTable() {
    const table = document.querySelector(".data-prod");
    table.style.visibility = "visible"; // Hacer visible la tabla
}

function sselect2() {
    // Destruir instancias previas de SlimSelect si existen
    slimSelectInstances.forEach(instance => {
        try {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        } catch (error) {
            console.error("Error al destruir instancia SlimSelect:", error);
        }
    });
    slimSelectInstances = []; // Limpiar el array de instancias

    let searchs = $('.searchInput').toArray();
    if (searchs.length === 0) {
        console.error("No se encontraron elementos con la clase '.searchInput'.");
        return;
    }

    // Crear nuevas instancias de SlimSelect
    searchs.forEach(element => {
        // Verificar que el elemento esté visible y tenga opciones
        if ($(element).is(':visible') && element.options && element.options.length > 1) {
            try {
                const instance = new SlimSelect({
                    select: element
                });
                slimSelectInstances.push(instance); // Guardar la instancia en el array
                console.log("SlimSelect inicializado en:", element);
            } catch (error) {
                console.error("Error al inicializar SlimSelect en el elemento:", element, error);
            }
        } else {
            console.warn("El elemento no es visible o no tiene opciones suficientes para inicializar SlimSelect:", element);
        }
    });
}

// Función genérica para obtener datos y cargar opciones en el select
function obtenerRegistros(url) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const selEqp = $('#mySelect');
            selEqp.empty();  // Limpiar opciones previas
            selEqp.append(new Option("Buscar...", "")).attr("disabled", true);

            if (data.length === 0) {
                console.warn("No se encontraron datos para mostrar.");
            } else {
                data.forEach(item => {
                    selEqp.append(new Option(item.nombre, item.nombre));
                });
                sselect2(); // Llamar a SlimSelect después de cargar las opciones
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

if (!Permisos['EMPLEADOS'] && !Permisos['USUARIOS']) {
    location.href = "index";
} else {
    if (pathname == "/users/modReg" && (Permisos['EMPLEADOS'].includes('3'))) {

        function modifyRegUsuario(oldNombre, num_emp, e) {

            e.preventDefault()
            const updatedData = {
                Num_emp: num_emp,
                Nombre: document.querySelector('.Nombre').value,
                Usuario: document.querySelector('.Usuario').value,
                Password: document.querySelector('.Password').value,
                dataOldNS: oldNombre,
                User: user

            };

            fetch('/registro/mod_reg_usu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    // Manejar la respuesta
                    if (data.type === 'RespDelEqp') {
                        showSuccessAlertReload(data.message);
                    } else {
                        showErrorAlert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                });
        }

        function modifyRegEmp(oldNombre, num_emp, e) {

            e.preventDefault()
            const updatedData = {
                Num_emp: num_emp,
                Nombre: document.querySelector('.Nombre2').value,
                Area: document.querySelector('.Area').value,
                Jefe: document.querySelector('.Jefe').value,
                dataOldNS: oldNombre,
                User: user

            };

            fetch('/registro/mod_reg_emp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            }).then(response => response.json())
                .then(data => {
                    if (data.type === 'RespDelEqp') {
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
        const edit1 = $('.EditData2');

        edit1.click(function (e) {

            var Nombre = $('.Nombre2').val();

            var modify = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="modifyRegEmp('${Nombre}','${Num_emp}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear()" name="cancelEqp" class="Cancel">';

            editsFunctions(modify, cancel)
        });
        const edit = $('.EditData');

        edit.click(function (e) {

            var Nombre = $('.Nombre').val();

            var modify = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="modifyRegUsuario('${Nombre}', '${Num_emp}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear()" name="cancelEqp" class="Cancel">';

            editsFunctions(modify, cancel)
        });
        // Función para inicializar SlimSelect en elementos con clase `.searchInput`
        function sselect() {
            console.log("Iniciando sselect...");

            let searchs = $('.searchInput').toArray();
            if (searchs.length === 0) {
                console.error("No se encontraron elementos con la clase '.searchInput'.");
                return;
            }

            searchs.forEach(element => {
                if (element.options.length > 1) {  // Asegurarse de que haya opciones antes de inicializar
                    try {
                        new SlimSelect({
                            select: element
                        });
                        console.log("SlimSelect inicializado en:", element);
                    } catch (error) {
                        console.error("Error al inicializar SlimSelect en el elemento:", element, error);
                    }
                } else {
                    console.warn("El elemento no tiene opciones suficientes para inicializar SlimSelect:", element);
                }
            });
        }

        // Fetch para cargar las opciones en el select y luego inicializar SlimSelect
        fetch('/registro', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const selEqp = $('#mySelect');
                // selEqp.empty();  // Limpiar opciones previas

                if (data.length === 0) {
                    console.warn("No se encontraron datos para mostrar.");
                } else {
                    // Cargar las opciones en el select
                    data.forEach(item => {
                        selEqp.append(new Option(item.nombre, item.nombre));
                    });

                    // Llamar a SlimSelect después de cargar las opciones
                    sselect();
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                const errorMessageElement = document.getElementById('errorMessage');
                if (errorMessageElement) {
                    errorMessageElement.innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                }
            });


        function cancel() {
            // clearContent();

            // Restaurar el contenido inicial de los botones
            $('.description-product').html(`
                <div class="actions two-boxes" style="height: 60%;">
                    <center>
                        <button class="options meter FTB" style="margin-right: 1rem;"><i
                                    class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Modificar Empleado</button>
                            <button class="options sacar FTB"><i class="fa-solid fa-circle-plus body-icons"
                                    style="font-size: 25px;"></i>Modificar Usuarios</button>
                    </center>
                </div>
            `);
            obtenerRegistrosUsuarios();
            // Volver a configurar los eventos para los botones
            CRUDButtons();
        }

        function CRUDButtons() {
            // Evento de clic en el botón "Modificar Empleado"
            $('.meter').click((e) => {
                obtenerRegistros('/registro/getRegistrosEmpleados');
                addBody(`
                    <div class="global_data">
                        <div class="DP">
                            <label>Empleado</label>
                            <input autocomplete="off" id="Nombre2" name="Nombre2" class="Nombre2 EditData2" required>
                        </div>
                        <div class="DP">
                            <label>Área</label>
                            <select id="Area" class="Area EditSelect EditData2" name="Area" required>
                                <option></option>
                                <option value="ADMINISTRACION">ADMINISTRACION</option>
                                <option value="PRIMARIA">PRIMARIA</option>
                                <option value="SECUNDARIA">SECUNDARIA</option>
                                <option value="SERVICIOS GENERALES">SERVICIOS GENERALES</option>
                                <option value="SERVICIOS GENERALES Y REC. MATERIALES">SERVICIOS GENERALES Y REC. MATERIALES</option>
                                <option value="COMPRAS">COMPRAS</option>
                                <option value="PREESCOLAR">PREESCOLAR</option>
                                <option value="DIRECCION ADMINISTRATIVA">DIRECCION ADMINISTRATIVA</option>
                                <option value="DIRECCION ACADEMICA">DIRECCION ACADEMICA</option>
                                <option value="PREPARATORIA">PREPARATORIA</option>
                                <option value="CONTROL ADMINISTRATIVO">CONTROL ADMINISTRATIVO</option>
                                <option value="APOYO ACADEMICO">APOYO ACADEMICO</option>
                                <option value="DIRECCION GENERAL">DIRECCION GENERAL</option>
                                <option value="RECURSOS HUMANOS Y CONTABILIDAD">RECURSOS HUMANOS Y CONTABILIDAD</option>
                                <option value="SISTEMAS">SISTEMAS</option>
                            </select>
                        </div>
                        <div class="DP">
                            <label>Jefe</label>
                            <select id="Jefe" class="Jefe EditSelect EditData2" name="Jefe" required></select>
                        </div>
                    </div>
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                `, e);

                colortable();
            });

            // Evento de clic en el botón "Sacar productos"
            $('.sacar').click((e) => {
                obtenerRegistros('/registro/getRegistrosUsuarios');
                addBody(`
                    <div class="global_data">
                        <div class="DP">
                            <label>Empleado Asignado</label>
                            <select id="Nombre" class="Nombre EditSelect EditData" name="Nombre" required></select>
                        </div>
                        <div class="DP">
                            <label>Nombre Usuario</label>
                            <input autocomplete="off" id="Usuario" name="Usuario" class="Usuario EditData" required >
                        </div>
                        <div class="DP">
                            <label>Contraseña Nueva</label>
                            <input autocomplete="off" id="Password" name="Password EditData" class="Password" required >
                        </div>
                    </div>
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                `, e);
                obtenerEmpleados().then(() => {
                    // Llamar a sselect después de llenar el select con empleados
                    sselect2();
                });

                colortable();

            });
        }
        function populateInputs(item) {
            console.log("Datos de item:", item); // Verificar el contenido de item

            const nombreSelect = $('.Nombre');
            if (nombreSelect.find(`option[value="${item.nombre}"]`).length) {
                nombreSelect.val(item.nombre);
            } else {
                nombreSelect.append(new Option(item.nombre, item.nombre, true, true));
            }

            $('.Usuario').val(item.usuario);
            $('.Password').val(item.password);

            // Asegúrate de que el select de nombre esté deshabilitado
            $('.Nombre').prop('disabled', true);

            // Asigna num_emp al evento de clic
            $('#modyEqp').attr('onclick', `modifyRegUsuario('${item.nombre}', '${item.numemp}', event)`);
        }


        function populateInputs2(item) {
            const nombreSelect = $('.Nombre2');
            const areaSelect = $('.Area');
            const jefeSelect = $('.Jefe');

            // Limpiar y agregar el nombre
            nombreSelect.empty(); // Limpiar opciones previas
            nombreSelect.append(new Option(item.nombre, item.nombre, true, true));
            nombreSelect.val(item.nombre);

            // Limpiar y agregar el área
            areaSelect.empty();

            // Crear un conjunto para rastrear las opciones únicas
            const uniqueAreas = new Set();

            // Agregar las opciones predefinidas del área si no están ya en el conjunto
            const areaOptions = [
                "ADMINISTRACION",
                "PREESCOLAR",
                "PRIMARIA",
                "SECUNDARIA",
                "PREPARATORIA",
                "SERVICIOS GENERALES",
                "SISTEMAS"
            ];

            areaOptions.forEach(optionText => {
                if (!uniqueAreas.has(optionText)) {
                    uniqueAreas.add(optionText);
                    areaSelect.append(new Option(optionText, optionText));
                }
            });

            // Agregar el área actual de `item` si no está ya en el conjunto
            if (!uniqueAreas.has(item.area)) {
                areaSelect.append(new Option(item.area, item.area, true, true));
            }
            areaSelect.val(item.area);

            // Asignar el valor fijo "Navarro Jimenez Martha Lidia" al campo de Jefe
            jefeSelect.empty(); // Limpiar opciones previas
            jefeSelect.append(new Option("NAVARRO JIMENEZ MARTHA LIDIA", "NAVARRO JIMENEZ MARTHA LIDIA", true, true));
            jefeSelect.val("NAVARRO JIMENEZ MARTHA LIDIA");
            jefeSelect.prop('disabled', true);

            // Habilitar los campos de nombre y área
            nombreSelect.prop('disabled', false);
            areaSelect.prop('disabled', false);

            $('#modyEqp').attr('onclick', `modifyRegEmp('${item.nombre}', '${item.numemp}', event)`);
        }

        // Función para obtener los datos de los usuarios y mostrarlos en la tabla
        function obtenerRegistrosUsuarios() {
            fetch('/registro/getRegistrosUsuarios')
                .then(response => response.json())
                .then(data => {
                    console.log("Datos recibidos del backend:", data);
                    const tbody = document.querySelector(".data-prod tbody");
                    const headers = document.getElementById('table-headers');
                    const selEqp = $('#mySelect');  // Assume `#mySelect` is the target select element

                    // Clear any existing content in table headers and body
                    headers.innerHTML = '';
                    tbody.innerHTML = '';

                    // Set table headers for users
                    headers.innerHTML = `
                        <th>Empleado</th>
                        <th>Usuario</th>
                    `;

                    // Clear and add default option to select
                    selEqp.empty();
                    selEqp.append(new Option("Buscar...", "")).attr("disabled", true);

                    // Populate table and select with new data
                    data.forEach(item => {
                        console.log("Item actual:", item);
                        // Populate select options
                        selEqp.append(new Option(item.nombre, item.nombre));

                        // Populate table rows
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.nombre || 'N/A'}</td>
                            <td>${item.usuario}</td>
                            <td class="hidden-column">${item.numemp})</td>

                        `;

                        // Attach click event listener to row
                        tr.addEventListener('click', () => populateInputs(item));
                        tbody.appendChild(tr);
                    });

                    // Attach a single change event listener to the select
                    selEqp.off('change').on('change', function () {
                        const selectedOption = $(this).val();
                        const selectedItem = data.find(item => item.nombre === selectedOption);

                        if (selectedItem) {
                            populateInputs(selectedItem);
                        }
                    });

                    // Make table visible
                    showTable();
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                    document.getElementById('errorMessage').innerText = 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.';
                });
        }

        function obtenerRegistrosEmpleados() {
            fetch('/registro/getRegistrosEmpleados')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector(".data-prod tbody");
                    const headers = document.getElementById('table-headers');
                    const selEqp = $('#mySelect');

                    // Limpiar cualquier contenido existente
                    headers.innerHTML = '';
                    tbody.innerHTML = '';

                    // Configurar los encabezados de la tabla solo para Nombre y Usuario
                    headers.innerHTML = `
                        <th>Nombre</th>
                        <th>Área</th>
                    `;

                    // Clear and add default option to select
                    selEqp.empty();
                    selEqp.append(new Option("Buscar...", "")).attr("disabled", true);

                    // Populate table and select with new data

                    // Llenar la tabla con los datos obtenidos
                    data.forEach(item => {
                        selEqp.append(new Option(item.nombre, item.nombre));

                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.nombre || 'N/A'}</td>
                            <td>${item.area}</td>
                            <td class="hidden-column">${item.numemp})</td>
                        `;
                        // Attach click event listener to row
                        tr.addEventListener('click', () => populateInputs2(item));
                        tbody.appendChild(tr);
                    });
                    // Attach a single change event listener to the select
                    selEqp.off('change').on('change', function () {
                        const selectedOption = $(this).val();
                        const selectedItem = data.find(item => item.nombre === selectedOption);

                        if (selectedItem) {
                            populateInputs2(selectedItem);
                        }
                    });
                    // Mostrar la tabla
                    showTable();
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                    document.getElementById('errorMessage').innerText = 'Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.';
                });
        }

        // Llamar a la función para mostrar los datos de los usuarios al cargar la página
        // window.addEventListener('load', obtenerRegistrosUsuarios);
        window.addEventListener('load', function (event) {
            obtenerRegistrosUsuarios();
            sselect2();
            CRUDButtons();
        });

    }
}   