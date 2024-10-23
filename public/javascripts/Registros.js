var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

function toggleContent() {
    var checkbox = document.getElementById("flag");
    var hiddenContent = document.getElementById("hidden-content");
    
    if (checkbox.checked) {
        hiddenContent.style.display = "block"; // Mostrar contenido
    } else {
        hiddenContent.style.display = "none"; // Ocultar contenido
    }
}

function validateForm(event) {
    // Obtener todos los checkboxes excepto el que tiene id="flag"
    var checkboxes = document.querySelectorAll('#mainForm input[type="checkbox"]:not(#flag)');
    
    // Verificar si al menos uno está seleccionado
    var isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    
    if (!isChecked) {
        // Usar SweetAlert2 para mostrar la alerta personalizada
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor, selecciona al menos una opción en los módulos.'
        });
        // Prevenir el envío del formulario
        event.preventDefault();
        return false;
    }
    
    showSuccessAlert("El formulario ha sido registrado correctamente.");
    
    // Simular una pausa antes de enviar el formulario
    setTimeout(function() {
        document.getElementById("mainForm").submit();
    }, 2000); // 2 segundos
}

// Añadir evento de validación al formulario
// document.getElementById("mainForm").addEventListener("submit", validateForm);

function toggleContentAndValidation() {
    var checkbox = document.getElementById("flag");
    var hiddenContent = document.getElementById("hidden-content");
    var empleadoCampos = document.querySelectorAll(".empleado-campo"); // Campos de "Registrar Empleado"

    if (checkbox.checked) {
        // Mostrar el contenido de usuario
        hiddenContent.style.display = "block"; 
        
        // Quitar 'required' de los campos de empleado
        empleadoCampos.forEach(function(campo) {
            campo.removeAttribute("required");
        });
    } else {
        // Ocultar el contenido de usuario
        hiddenContent.style.display = "none";

        // Agregar 'required' de nuevo a los campos de empleado
        empleadoCampos.forEach(function(campo) {
            campo.setAttribute("required", "required");
        });
    }
}

function RegistrarPermisos() {
    // Inicializar addData como un objeto que contenga un array de permisos/módulos
    addData = {
        Empleado: document.querySelector('.Empleado').value,
        Usuario: document.querySelector('.Usuario').value,
        Password: document.querySelector('.Password').value,
        User: user,
        Permisos: []  // Aquí almacenamos todos los permisos y módulos
    };

    // Recolectar permisos de todos los módulos
    const modulos = ['Almacen', 'Mobiliario', 'Equipos', 'Usuarios', 'Empleados', 'Responsivas'];
    
    modulos.forEach(modulo => {
        const checkboxes = document.querySelectorAll(`#${modulo} input[type="checkbox"]`);
        checkboxes.forEach(permiso => {
            if (permiso.checked) {
                addData.Permisos.push({
                    Modulo: modulo.toUpperCase(),
                    Permiso: permiso.value
                });
            }
        });
    });
}


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

            const selectElement = document.getElementById('empleados');

            // Limpiar las opciones existentes
            selectElement.innerHTML = '<option value="">Empleado Asignado</option>';

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
if (Permisos && Permisos['USUARIOS'] && Permisos['EMPLEADOS'] && Permisos['USUARIOS'].includes('1') && Permisos['EMPLEADOS'].includes('1') && pathname == "/users/registros") {    
    console.log("Ambos permisos activos")

    function addEmpleado(e) {
        e.preventDefault();

        const addData = {
            Nom: document.querySelector('.Nom').value,
            Area: document.querySelector('.Area').value,
            Jefe: document.querySelector('.Jefe').value,
            User: user
        };
        console.log("Datos enviados:", addData);
        if (!checkEmptyFields(addData)) {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error",
                text: 'Debes llenar todos los datos para continuar.',
            });
        } else {
            fetch('/registro/new_reg_emp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addData)
            }).then(response => response.json())
                .then(data => {
                    if (data.type === 'success') {
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
    }

    function addUsuario(e) {
        e.preventDefault();

        RegistrarPermisos();

        if (!checkEmptyFields(addData)) {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error",
                text: 'Debes llenar todos los datos para continuar.',
            });
        } else {
            fetch('/registro/new_reg_usu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addData)
            }).then(response => response.json())
                .then(data => {
                    if (data.type === 'success') {
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
    }   

    function CRUDButtons() {
        $('.description-product').html(`
            <div class="actions two-boxes-registro" style="height: 60%;">
                <center>
                    <button class="options meter FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Empleado</button>
                    <button class="options sacar FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Usuario</button>
                    </center>
            </div>`)
            $('.meter').click((e) => {
                addBody(`
                    <div class="DP">
                            <label>Empleado</label>
                            <input type="text" class="Pname Nom" id="Nom" name="Nom" value="" placeholder="Nombre Empleado" required>
                        </div>
                        <div class="DP">
                            <label>Area</label>
                            <select id="Area" name="Area" class="empleado-campo searchInput Area" required >
                                <option value="">Área</option>
                                <option>ADMINISTRACION</option>
                                <option>PREESCOLAR</option>
                                <option>PRIMARIA</option>
                                <option>SECUNDARIA</option>
                                <option>PREPARATORIA</option>
                                <option>SERVICIOS GENERALES</option>
                                <option>SISTEMAS</option>
                            </select>
                        </div>
                        <div class="DP">
                            <label>Jefe</label>
                            <select id="Jefe" name="Jefe" class="empleado-campo searchInput Jefe" required>
                                <option>Jefe</option>
                                <option> Navarro Jimenez Martha Lidia</option>
                            </select>
                    </div>
                    
                    <div class="buttons">
                        <input type="submit" value="Guardar "id="registrarEmpleado" value="Registrar Empleado" onclick="addEmpleado(event)">
                        <input type="submit" value="Cancelar" id="" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e);
                    sselect();
            });
            $('.sacar').click((e) => {
                addBody(`
                    <div class="DP">
                        <label for="empleados" >Empleado Asignado</label>
                        <select id="empleados" name="Fname" class="searchInput Empleado"  required>
                            <option value="">Empleado Asignado</option>
                        </select>
                    </div>
                    <div class="DP">
                        <label>Nombre Usuario</label>
                        <input type="text" class="test Usuario" name="a" placeholder="Nombre Usuario" required>
                    </div>
                    <div class="DP">
                        <label>Contraseña Nueva</label>
                        <input type="password" class="testing Password" name="s" placeholder="Contraseña Nueva" required>
                    </div>
                    <div class="subtitle-container">
                        Asignar Módulos
                    </div>
                    <div class="module-section">
                        <div class="module-category" id="Almacen">
                            <div class="subsubtitle-container">Almacén</div>
                            <div class="DPU">
                                <label for="addalmacen">Altas</label>
                                <input type="checkbox" id="addalmacen" name="addalmacen" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delalmacen">Bajas</label>
                                <input type="checkbox" id="delalmacen" name="delalmacen" value="2">
                            </div>
                            <div class="DPU">
                                <label for="modalmacen">Cambios</label>
                                <input type="checkbox" id="modalmacen" name="modalmacen" value="3">
                            </div>
                            <div class="DPU">
                                <label for="conalmacen">Consultas</label>
                                <input type="checkbox" id="conalmacen" name="conalmacen" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Mobiliario">
                            <div class="subsubtitle-container">Mobiliario</div>
                            <div class="DPU">
                                <label for="addmobiliario">Altas</label>
                                <input type="checkbox" id="addmobiliario" name="addmobiliario" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delmobiliario">Bajas</label>
                                <input type="checkbox" id="delmobiliario" name="delmobiliario" value="2">
                            </div>
                            <div class="DPU">
                                <label for="modmobiliario">Cambios</label>
                                <input type="checkbox" id="modmobiliario" name="modmobiliario" value="3">
                            </div>
                            <div class="DPU">
                                <label for="conmobiliario">Consultas</label>
                                <input type="checkbox" id="conmobiliario" name="conmobiliario" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Equipos">
                            <div class="subsubtitle-container">Equipos</div>
                            <div class="DPU">
                                <label for="addequipos">Altas</label>
                                <input type="checkbox" id="addequipos" name="addequipos" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delequipos">Bajas</label>
                                <input type="checkbox" id="delequipos" name="delequipos" value="2">
                            </div>
                            <div class="DPU"> 
                                <label for="modequipos">Cambios</label>
                                <input type="checkbox" id="modequipos" name="modequipos" value="3">
                            </div>
                            <div class="DPU"> 
                                <label for="conequipos">Consultas</label>
                                <input type="checkbox" id="conequipos" name="conequipos" value="4">
                            </div>
                        </div>
                    </div>
                    <div class="module-section">
                        <div class="module-category" id="Usuarios">
                            <div class="subsubtitle-container">Usuarios</div>
                            <div class="DPU">
                                <label for="addusuario">Altas</label>
                                <input type="checkbox" id="addusuario" name="addusuario" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delusuario">Bajas</label>
                                <input type="checkbox" id="delusuario" name="delusuario" value="2">
                            </div>
                            <div class="DPU"> 
                                <label for="modusuario">Cambios</label>
                                <input type="checkbox" id="modusuario" name="modusuario" value="3">
                            </div>
                            <div class="DPU">   
                                <label for="conusuario">Consultas</label>
                                <input type="checkbox" id="conusuario" name="conusuario" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Empleados">
                            <div class="subsubtitle-container">Empleados</div>
                            <div class="DPU">
                                <label for="addempleado">Altas</label>
                                <input type="checkbox" id="addempleado" name="addempleado" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delempleado">Bajas</label>
                                <input type="checkbox" id="delempleado" name="delempleado" value="2">
                            </div>
                            <div class="DPU"> 
                                <label for="modempleado">Cambios</label>
                                <input type="checkbox" id="modempleado" name="modempleado" value="3">
                            </div>
                            <div class="DPU">   
                                <label for="conempleado">Consultas</label>
                                <input type="checkbox" id="conempleado" name="conempleado" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Responsivas">
                            <div class="subsubtitle-container">Responsivas</div>
                            <div class="DPU">
                                <label for="addresponsiva">Agregar</label>
                                <input type="checkbox" id="addresponsiva" name="addresponsiva" value="1">
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
                        </div>
                    </div>
                    <div class="buttons">
                        <input type="submit" value="Guardar" id="" onclick="addUsuario(event)" name="" class="">
                        <input type="submit" value="Cancelar" id="" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e);
                    obtenerEmpleados().then(() => {
                        // Llamar a sselect después de llenar el select con empleados
                        sselect();
                    });
                });
    }

    function cancel() {
        $('.description-product').html(`
            <div class="actions two-boxes-registro" style="height: 60%;">
                <center>
                    <button class="options meter registro FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Empleado </button>
                    <button class="options sacar FTB"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Usuarios</button>
                    </center>
            </div>`)
        CRUDButtons();
    }

    window.addEventListener('load', function (event) {
        CRUDButtons();
    });
    
}
// solo empleados
else if (Permisos && Permisos['EMPLEADOS'] && Permisos['EMPLEADOS'].includes('1') && pathname == "/users/registros") {     
    console.log("1")   
    function addEmpleado(e){
        e.preventDefault();

        const addData = {
            Nom: document.querySelector('.Nom').value,
            Area: document.querySelector('.Area').value,
            Jefe: document.querySelector('.Jefe').value,
            User: user
        };
        console.log("Datos enviados:", addData);
        if (!checkEmptyFields(addData)) {
            Swal.fire({
                icon: "error",
                title: "Ocurrió un error",
                text: 'Debes llenar todos los datos para continuar.',
            })
        } else {
            fetch('/registro/new_reg_emp', {
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

    function CRUDButtons() {
        $('.description-product').html(`
            <div class="actions two-boxes-registro" style="height: 60%;">
                <center>
                    <button class="options meter FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Empleado</button>
                </center>
            </div>`)
        $('.meter').click((e) => {
            addBody(`
                <div class="DP">
                        <label>Empleado</label>
                        <input type="text" class="Pname Nom" id="Nom" name="Nom" value="" placeholder="Nombre Empleado" required>
                    </div>
                    <div class="DP">
                        <label>Area</label>
                        <select id="Area" name="Area" class="empleado-campo searchInput Area" required >
                            <option value="">Área</option>
                            <option>ADMINISTRACION</option>
                            <option>PREESCOLAR</option>
                            <option>PRIMARIA</option>
                            <option>SECUNDARIA</option>
                            <option>PREPARATORIA</option>
                            <option>SERVICIOS GENERALES</option>
                            <option>SISTEMAS</option>
                        </select>
                    </div>
                    <div class="DP">
                        <label>Jefe</label>
                        <select id="Jefe" name="Jefe" class="empleado-campo searchInput Jefe" required>
                            <option>Jefe</option>
                            <option> Navarro Jimenez Martha Lidia</option>
                        </select>
                </div>
                
                <div class="buttons">
                    <input type="submit" value="Guardar" id="" onclick="addEmpleado(event)" name="" class="">
                    <input type="submit" value="Cancelar" id="" onclick="cancel()" name="cancelEqp" class="Cancel">
                </div>
                `, e);
                sselect();
        });
    }
    function cancel() {
        $('.description-product').html(`
            <div class="actions two-boxes-registro" style="height: 60%;">
                <center>
                    <button class="options meter FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Empleado</button>
                </center>
            </div>`)
        CRUDButtons()
    }

    window.addEventListener('load', function (event) {
        CRUDButtons()
    })
    

    }

// solo usuarios
else if (Permisos && Permisos['USUARIOS'] && Permisos['USUARIOS'].includes('1') && pathname == "/users/registros") {
    console.log("2")
        function addUsuario(e){
            e.preventDefault();

            RegistrarPermisos();

            if (!checkEmptyFields(addData)) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    text: 'Debes llenar todos los datos para continuar.',
                })
            } else {
                fetch('/registro/new_reg_usu', {
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
        function CRUDButtons() {
            $('.description-product').html(`
                <div class="actions two-boxes-registro" style="height: 60%;">
                    <center>
                        <button class="options sacar FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Usuario</button>
                    </center>
                </div>`)
            $('.sacar').click((e) => {
                addBody(`
                    <div class="DP">
                        <label for="empleados" >Empleado Asignado</label>
                        <select id="empleados" name="Fname" class="searchInput Empleado"  required>
                            <option value="">Empleado Asignado</option>
                        </select>
                    </div>
                    <div class="DP">
                        <label>Nombre Usuario</label>
                        <input type="text" class="test Usuario" name="a" placeholder="Nombre Usuario" required>
                    </div>
                    <div class="DP">
                        <label>Contraseña Nueva</label>
                        <input type="password" class="testing Password" name="s" placeholder="Contraseña Nueva" required>
                    </div>
                    <div class="subtitle-container">
                        Asignar Módulos
                    </div>
                    <div class="module-section">
                        <div class="module-category" id="Almacen">
                            <div class="subsubtitle-container">Almacén</div>
                            <div class="DPU">
                                <label for="addalmacen">Altas</label>
                                <input type="checkbox" id="addalmacen" name="addalmacen" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delalmacen">Bajas</label>
                                <input type="checkbox" id="delalmacen" name="delalmacen" value="2">
                            </div>
                            <div class="DPU">
                                <label for="modalmacen">Cambios</label>
                                <input type="checkbox" id="modalmacen" name="modalmacen" value="3">
                            </div>
                            <div class="DPU">
                                <label for="conalmacen">Consultas</label>
                                <input type="checkbox" id="conalmacen" name="conalmacen" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Mobiliario">
                            <div class="subsubtitle-container">Mobiliario</div>
                            <div class="DPU">
                                <label for="addmobiliario">Altas</label>
                                <input type="checkbox" id="addmobiliario" name="addmobiliario" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delmobiliario">Bajas</label>
                                <input type="checkbox" id="delmobiliario" name="delmobiliario" value="2">
                            </div>
                            <div class="DPU">
                                <label for="modmobiliario">Cambios</label>
                                <input type="checkbox" id="modmobiliario" name="modmobiliario" value="3">
                            </div>
                            <div class="DPU">
                                <label for="conmobiliario">Consultas</label>
                                <input type="checkbox" id="conmobiliario" name="conmobiliario" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Equipos">
                            <div class="subsubtitle-container">Equipos</div>
                            <div class="DPU">
                                <label for="addequipos">Altas</label>
                                <input type="checkbox" id="addequipos" name="addequipos" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delequipos">Bajas</label>
                                <input type="checkbox" id="delequipos" name="delequipos" value="2">
                            </div>
                            <div class="DPU"> 
                                <label for="modequipos">Cambios</label>
                                <input type="checkbox" id="modequipos" name="modequipos" value="3">
                            </div>
                            <div class="DPU"> 
                                <label for="conequipos">Consultas</label>
                                <input type="checkbox" id="conequipos" name="conequipos" value="4">
                            </div>
                        </div>
                    </div>
                    <div class="module-section">
                        <div class="module-category" id="Usuarios">
                            <div class="subsubtitle-container">Usuarios</div>
                            <div class="DPU">
                                <label for="addusuario">Altas</label>
                                <input type="checkbox" id="addusuario" name="addusuario" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delusuario">Bajas</label>
                                <input type="checkbox" id="delusuario" name="delusuario" value="2">
                            </div>
                            <div class="DPU"> 
                                <label for="modusuario">Cambios</label>
                                <input type="checkbox" id="modusuario" name="modusuario" value="3">
                            </div>
                            <div class="DPU">   
                                <label for="conusuario">Consultas</label>
                                <input type="checkbox" id="conusuario" name="conusuario" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Empleados">
                            <div class="subsubtitle-container">Empleados</div>
                            <div class="DPU">
                                <label for="addempleado">Altas</label>
                                <input type="checkbox" id="addempleado" name="addempleado" value="1">
                            </div>
                            <div class="DPU">
                                <label for="delempleado">Bajas</label>
                                <input type="checkbox" id="delempleado" name="delempleado" value="2">
                            </div>
                            <div class="DPU"> 
                                <label for="modempleado">Cambios</label>
                                <input type="checkbox" id="modempleado" name="modempleado" value="3">
                            </div>
                            <div class="DPU">   
                                <label for="conempleado">Consultas</label>
                                <input type="checkbox" id="conempleado" name="conempleado" value="4">
                            </div>
                        </div>
                        <div class="module-category" id="Responsivas">
                            <div class="subsubtitle-container">Responsivas</div>
                            <div class="DPU">
                                <label for="addresponsiva">Agregar</label>
                                <input type="checkbox" id="addresponsiva" name="addresponsiva" value="1">
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
                        </div>
                    </div>
                    <div class="buttons">
                        <input type="submit" value="Guardar" id="" onclick="addUsuario(event)" name="" class="">
                        <input type="submit" value="Cancelar" id="" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e);
                    obtenerEmpleados().then(() => {
                        // Llamar a sselect después de llenar el select con empleados
                        sselect();
                    });
                });
        }

        function cancel() {
            $('.description-product').html(`
                <div class="actions two-boxes-registro" style="height: 60%;">
                    <center>
                        <button class="options sacar FTB"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Usuarios</button>
                    </center>
                </div>`)
            CRUDButtons()
        }

        window.addEventListener('load', function (event) {
            CRUDButtons()
        })
        

    }    
else{
    location.href = "index";
}
