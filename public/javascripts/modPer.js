var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');
let slimSelectInstances = [];

function handleRowClick(item) {
    // Seleccionar el contenedor donde se mostrará el contenido
    const contentContainer = document.querySelector(".referencia");

    // Asegurarnos de que el contenedor existe
    if (!contentContainer) {
        console.error("El contenedor .description-product no existe.");
        return;
    }

    // Contenido HTML que deseas mostrar
    const moduleContent = `
    <div class="subtitle-container">
                Detalles de los Permisos del usuario: ${item.nombre}
            </div>
            <i class="fa-solid fa-trash trash" aria-hidden="true"
                style="float: right; color: #001781; visibility: hidden;"></i>
            <i class="fa fa-pencil-square-o edit" aria-hidden="true"
                style="float: right; color: #001781; visibility: hidden;"></i>

            <form method="POST" enctype="multipart/form-data" style="height: 100%;">
                <div class="description-product" style="height: 100%;">
            </form>
    <div class="actions two-boxes" style="height: 60%;">
                                    <div class="module-section">
                                <div class="subsubtitle-container">Almacén</div>
                                <div class="module-category" id="Almacen">
                                    <div class="DPU">
                                        <label for="addalmacen">Altas</label>
                                        <input type="checkbox" id="addalmacen" name="addalmacen" class="EditData" value="1">
                                    </div>
                                    <div class="DPU">
                                        <label for="delalmacen">Bajas</label>
                                        <input type="checkbox" id="delalmacen" name="delalmacen" class="EditData" value="2">
                                    </div>
                                    <div class="DPU">
                                        <label for="modalmacen">Cambios</label>
                                        <input type="checkbox" id="modalmacen" name="modalmacen" class="EditData" value="3">
                                    </div>
                                    <div class="DPU">
                                        <label for="conalmacen">Consultas</label>
                                        <input type="checkbox" id="conalmacen" name="conalmacen" class="EditData" value="4">
                                    </div>
                                </div>
                                <div class="subsubtitle-container">Mobiliario</div>
                                <div class="module-category" id="Mobiliario">
                                    <div class="DPU">
                                        <label for="addmobiliario">Altas</label>
                                        <input type="checkbox" id="addmobiliario" name="addmobiliario" class="EditData" value="1">
                                    </div>
                                    <div class="DPU">
                                        <label for="delmobiliario">Bajas</label>
                                        <input type="checkbox" id="delmobiliario" name="delmobiliario" class="EditData" value="2">
                                    </div>
                                    <div class="DPU">
                                        <label for="modmobiliario">Cambios</label>
                                        <input type="checkbox" id="modmobiliario" name="modmobiliario" class="EditData" value="3">
                                    </div>
                                    <div class="DPU">
                                        <label for="conmobiliario">Consultas</label>
                                        <input type="checkbox" id="conmobiliario" name="conmobiliario" class="EditData" value="4">
                                    </div>
                                    <div class="DPU">
                                        <label for="adminmobiliario">Administrador</label>
                                        <input type="checkbox" id="adminmobiliario" name="adminmobiliario" value="5">
                                    </div>
                                </div>
                            </div>
                            <div class="module-section">
                                <div class="subsubtitle-container">Equipos</div>
                                <div class="module-category" id="Equipos">
                                    <div class="DPU">
                                        <label for="addequipos">Altas</label>
                                        <input type="checkbox" id="addequipos" name="addequipos" class="EditData" value="1">
                                    </div>
                                    <div class="DPU">
                                        <label for="delequipos">Bajas</label>
                                        <input type="checkbox" id="delequipos" name="delequipos" class="EditData" value="2">
                                    </div>
                                    <div class="DPU"> 
                                        <label for="modequipos">Cambios</label>
                                        <input type="checkbox" id="modequipos" name="modequipos" class="EditData" value="3">
                                    </div>
                                    <div class="DPU"> 
                                        <label for="conequipos">Consultas</label>
                                        <input type="checkbox" id="conequipos" name="conequipos" class="EditData" value="4">
                                    </div>
                                </div>
                                <div class="subsubtitle-container">Usuarios</div>
                                <div class="module-category" id="Usuarios">
                                    <div class="DPU">
                                        <label for="addusuario">Altas</label>
                                        <input type="checkbox" id="addusuario" name="addusuario" class="EditData" value="1">
                                    </div>
                                    <div class="DPU">
                                        <label for="delusuario">Bajas</label>
                                        <input type="checkbox" id="delusuario" name="delusuario" class="EditData "value="2">
                                    </div>
                                    <div class="DPU"> 
                                        <label for="modusuario">Cambios</label>
                                        <input type="checkbox" id="modusuario" name="modusuario" class="EditData" value="3">
                                    </div>
                                    <div class="DPU">   
                                        <label for="conusuario">Consultas</label>
                                        <input type="checkbox" id="conusuario" name="conusuario" class="EditData" value="4">
                                    </div>
                                    <div class="DPU hidden">
                                        <label for="b">Bajas</label>
                                        <input type="checkbox" id="b" name="">
                                    </div>
                                </div>
                            </div>
                            <div class="module-section">
                                <div class="subsubtitle-container">Empleados</div>
                                <div class="module-category" id="Empleados">
                                    <div class="DPU">
                                        <label for="addempleado">Altas</label>
                                        <input type="checkbox" id="addempleado" name="addempleado" class="EditData" value="1">
                                    </div>
                                    <div class="DPU">
                                        <label for="delempleado">Bajas</label>
                                        <input type="checkbox" id="delempleado" name="delempleado" class="EditData" value="2">
                                    </div>
                                    <div class="DPU"> 
                                        <label for="modempleado">Cambios</label>
                                        <input type="checkbox" id="modempleado" name="modempleado" class="EditData" value="3">
                                    </div>
                                    <div class="DPU">   
                                        <label for="conempleado">Consultas</label>
                                        <input type="checkbox" id="conempleado" name="conempleado" class="EditData" value="4">
                                    </div>
                                </div>
                                <div class="subsubtitle-container">Responsivas</div>
                                <div class="module-category" id="Responsivas">
                                    <div class="DPU">
                                        <label for="addresponsiva">Agregar</label>
                                        <input type="checkbox" id="addresponsiva" name="addresponsiva" class="EditData" value="1">
                                    </div>
                                    <div class="DPU hidden">
                                        <label for="b">Bajas</label>
                                        <input type="checkbox" id="b" name="">
                                    </div>
                                    <div class="DPU hidden"> 
                                        <label for="c">Cambios</label>
                                        <input type="checkbox" id="c" name="">
                                    </div>
                                    <div class="DPU hidden">   
                                        <label for="d">Consultas</label>
                                        <input type="checkbox" id="d" name="">
                                    </div>
                                    <div class="DPU hidden">
                                        <label for="b">Bajas</label>
                                        <input type="checkbox" id="b" name="">
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="DP buttons">
                    <input type="submit" value="Guardar" id="modyEqp" name="modyEqp" class="Modify">
                    <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                </div>
    `;

    // Insertar el contenido en el contenedor
    contentContainer.innerHTML = moduleContent;
    obtenerPermisosPorUsuario(item.usuario);
    $('#modyEqp').attr('onclick', `modifyRegPermisos('${item.usuario}', event)`);
}

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
            } catch (error) {
                console.error("Error al inicializar SlimSelect en el elemento:", element, error);
            }
        } else {
            // console.warn("El elemento no es visible o no tiene opciones suficientes para inicializar SlimSelect:", element);
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
            // console.warn("No se encontraron datos para mostrar.");
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

function obtenerPermisosPorUsuario(usuario) {
    if (!usuario) {
        console.error("Usuario no especificado. Seleccione un usuario primero.");
        return;
    }
    // Fetch the permissions for the selected user
    fetch(`/registro/getRegistrosPermisos?usuario=${encodeURIComponent(usuario)}`)
        .then(response => response.json())
        .then(data => {
            // Check if data is an array before iterating
            if (!Array.isArray(data)) {
                console.error("Datos inesperados recibidos:", data);
                return;
            }

            // Clear all checkboxes
            document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
                checkbox.checked = false;
            });

            // Populate checkboxes based on the permissions received
            data.forEach(permiso => {
                // Construct the checkbox ID using the module and permission
                const checkboxId = getCheckboxId(permiso.modulo, permiso.permiso);
                const checkbox = document.getElementById(checkboxId);

                if (checkbox) {
                    checkbox.checked = true; // Check the corresponding checkbox
                } 
            });
        })
        .catch(error => {
            console.error('Error al obtener los permisos:', error);
        });
}

function getCheckboxId(modulo, permiso) {
    // Map modules to the corresponding checkbox ID suffix
    const moduloMap = {
        'ALMACÉN': 'almacen',
        'MOBILIARIO': 'mobiliario',
        'EQUIPOS': 'equipos',
        'USUARIOS': 'usuario',
        'EMPLEADOS': 'empleado',
        'RESPONSIVAS': 'responsiva'
    };

    // Map permissions to the corresponding prefix
    const permisoMap = {
        1: 'add',
        2: 'del',
        3: 'mod',
        4: 'con',
        5: 'admin'
    };

    // Return the constructed checkbox ID
    return `${permisoMap[permiso]}${moduloMap[modulo]}`;
}

if (!Permisos['EMPLEADOS'] && !Permisos['USUARIOS']) {
    location.href = "index";
} else {
    if (pathname == "/users/modPer" && (Permisos['EMPLEADOS'].includes('3'))){

        function modifyRegPermisos(usuario, e) {

            e.preventDefault()  
            // Collect updated permissions from checkboxes
            const permissions = [];

            document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
                if (checkbox.checked) {
                    const permiso = parseInt(checkbox.value);
                    const modulo = checkbox.closest(".module-category").id;
                    permissions.push({ permiso, modulo });
                }
            });

            // Prepare the data to send to the backend
            const updatedData = {
                Usuario: usuario,
                Permissions: permissions
            };

            fetch('/registro/mod_reg_per', {
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
        // document.querySelector('.Modify').addEventListener('click', function (e) {

        //     const usuario = document.querySelector('.Usuario').value;
        //     modifyRegPermisos(usuario, e);
        // });
        
        const edit = $('.EditData');

        edit.click(function (e) {
            e.preventDefault();
            var Usuario = $('.Usuario').val();

            var modify = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="modifyRegPermisos('${Usuario}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear()" name="cancelEqp" class="Cancel">';

            editsFunctions(modify, cancel)
        });
        // Función para inicializar SlimSelect en elementos con clase `.searchInput`
        function sselect() {

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
                    } catch (error) {
                        console.error("Error al inicializar SlimSelect en el elemento:", element, error);
                    }
                } else {
                    // console.warn("El elemento no tiene opciones suficientes para inicializar SlimSelect:", element);
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
                // console.warn("No se encontraron datos para mostrar.");
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
            // Restaurar el contenido inicial de los botones
            $('.referencia').html(`
                <div class="aviso">Selecciona a un usuario para modificar los permisos que tiene dentro del sistema</div>
            `);
            document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
                checkbox.checked = false;
            });
            obtenerRegistrosUsuarios();
            
        }

        function populateInputs(item) {
        
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
            $('#modyEqp').attr('onclick', `modifyRegPermisos('${item.nombre}', '${item.numemp}', event)`);
        }
        
        function obtenerRegistrosUsuarios() {
            fetch('/registro/getRegistrosUsuarios')
                .then(response => response.json())
                .then(data => {
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
                        tr.addEventListener('click', () => handleRowClick(item));
                        // obtenerPermisosPorUsuario(item.usuario);
                        tbody.appendChild(tr);
                    });
        
                    // Attach a single change event listener to the select
                    selEqp.off('change').on('change', function () {
                        const selectedOption = $(this).val();
                        const selectedItem = data.find(item => item.nombre === selectedOption);
                        
                        if (selectedItem) {
                            handleRowClick(selectedItem);
                            // obtenerPermisosPorUsuario(item.usuario);
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

        // Función para obtener los datos de los usuarios y mostrarlos en la tabla
        function obtenerRegistrosPermisos() {
            fetch('/registro/getRegistrosPermisos')
                .then(response => response.json())
                .then(data => {
                    
                    const tbody = document.querySelector(".data-prod tbody");
                    const headers = document.getElementById('table-headers');
                    const selEqp = $('#mySelect');  // Assume `#mySelect` is the target select element
        
                    // Clear any existing content in table headers and body
                    headers.innerHTML = '';
                    tbody.innerHTML = '';
        
                    // Set table headers for users
                    headers.innerHTML = `
                        <th>Usuario</th>
                    `;
        
                    // Clear and add default option to select
                    selEqp.empty();
                    selEqp.append(new Option("Buscar...", "")).attr("disabled", true);
        
                    // Populate table and select with new data
                    data.forEach(item => {
                        // Populate select options
                        selEqp.append(new Option(item.nombre, item.nombre));
        
                        // Populate table rows
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.usuario}</td>
                            <td class="hidden-column">${item.numemp})</td>

                        `;
                        
                        // Attach click event listener to row
                        // tr.addEventListener('click', () => populateInputs(item));
                        tr.addEventListener('click', () => handleRowClick(item));
                        // tr.addEventListener('click', () => obtenerPermisosPorUsuario(item.usuario));

                        tbody.appendChild(tr);
                    });
        
                    // Attach a single change event listener to the select
                    selEqp.off('change').on('change', function () {
                        const selectedOption = $(this).val();
                        const selectedItem = data.find(item => item.usuario === selectedOption);
                        
                        if (selectedItem) {
                            // populateInputs(selectedItem);
                            handleRowClick(selectedItem);
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

        // Llamar a la función para mostrar los datos de los usuarios al cargar la página
        window.addEventListener('load', function (event) {
            // obtenerRegistrosPermisos();
            obtenerRegistrosUsuarios();
            sselect2();
        });

    }
} 