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
document.getElementById("mainForm").addEventListener("submit", validateForm);

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

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/registros" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {

        // function agregarPE(e) {
        //     e.preventDefault()
        //     let productos = []
        //     $('.description-product .DP').each(
        //         function () {
        //             let producto = $(this).find('label').attr('article');
        //             let cantidad = $(this).find('input[type="number"]').val()

        //             if (producto && cantidad) {
        //                 productos.push({
        //                     producto: producto,
        //                     cantidad: cantidad
        //                 });
        //             } else {
        //                 showErrorAlert('Debes de llenar todos los campos antes de enviar el formulario.')
        //             }
        //         }
        //     )

        //     if (productos.length > 0) {
        //         fetch('/prod_exts/add', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(productos)
        //         }).then(response => response.json())
        //             .then(data => {

        //             })
        //             .catch(error => {
        //                 console.error('Error en la solicitud:', error);
        //                 document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
        //             });
        //     } else {
        //         showErrorAlert('No hay productos para enviar.');
        //     }


        // }

        function CRUDButtons() {
            $('.meter').click((e) => {
                addBody(`
                    <div class="DP">
                            <label>Empleado</label>
                            <input type="text" class="Pname" name="a" value="" placeholder="Nombre Empleado" required>
                        </div>
                        <div class="DP">
                            <label>Area</label>
                            <select id="Fname" name="Fname" class="empleado-campo" required >
                                <option value=""></option>
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
                            <select id="Fname" name="Fname" class="empleado-campo" required>
                                <option></option>
                                <option> Navarro Jimenez Martha Lidia</option>
                            </select>
                    </div>
                    <div class="buttons">
                        <input type="submit" value="Guardar" id="" name="" class="">
                        <input type="submit" value="Cancelar" id="" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)
            })

            $('.sacar').click((e) => {
                addBody(`
                    <div class="DP">
                        <label>Empleado Asignado</label>
                        <select id="Fname" name="Fname" class="Fname EditData" aria-placeholder="Buscar empleado" required>
                            <option></option>
                            <option>test</option>
                        </select>
                    </div>
                    <div class="DP">
                        <label>Nombre Usuario</label>
                        <input type="text" class="" name="a" placeholder="Nombre Usuario" required>
                    </div>
                    <div class="DP">
                        <label>Contraseña Nueva</label>
                        <input type="password" class="" name="s" placeholder="Contraseña Nueva" required>
                    </div>
                    <div class="subtitle-container">
                        Asignar Módulos
                    </div>
                    <div class="module-section">
                        <div class="module-category">
                            <div class="subsubtitle-container">Almacén</div>
                            <div class="DPU">
                                <label for="addalmacen">Altas</label>
                                <input type="checkbox" id="addalmacen" name="addalmacen">
                            </div>
                            <div class="DPU">
                                <label for="delalmacen">Bajas</label>
                                <input type="checkbox" id="delalmacen" name="delalmacen">
                            </div>
                            <div class="DPU">
                                <label for="modalmacen">Cambios</label>
                                <input type="checkbox" id="modalmacen" name="modalmacen">
                            </div>
                            <div class="DPU">
                                <label for="conalmacen">Consultas</label>
                                <input type="checkbox" id="conalmacen" name="conalmacen">
                            </div>
                        </div>
                        <div class="module-category">
                            <div class="subsubtitle-container">Mobiliario</div>
                            <div class="DPU">
                                <label for="addmobiliario">Altas</label>
                                <input type="checkbox" id="addmobiliario" name="addmobiliario">
                            </div>
                            <div class="DPU">
                                <label for="delmobiliario">Bajas</label>
                                <input type="checkbox" id="delmobiliario" name="delmobiliario">
                            </div>
                            <div class="DPU">
                                <label for="modmobiliario">Cambios</label>
                                <input type="checkbox" id="modmobiliario" name="modmobiliario">
                            </div>
                            <div class="DPU">
                                <label for="conmobiliario">Consultas</label>
                                <input type="checkbox" id="conmobiliario" name="conmobiliario">
                            </div>
                        </div>
                        <div class="module-category">
                            <div class="subsubtitle-container">Equipos</div>
                            <div class="DPU">
                                <label for="addequipos">Altas</label>
                                <input type="checkbox" id="addequipos" name="addequipos">
                            </div>
                            <div class="DPU">
                                <label for="delequipos">Bajas</label>
                                <input type="checkbox" id="delequipos" name="delequipos">
                            </div>
                            <div class="DPU"> 
                                <label for="modequipos">Cambios</label>
                                <input type="checkbox" id="modequipos" name="modequipos">
                            </div>
                            <div class="DPU"> 
                                <label for="conequipos">Consultas</label>
                                <input type="checkbox" id="conequipos" name="conequipos">
                            </div>
                        </div>
                    </div>
                    <div class="module-section">
                        <div class="module-category">
                            <div class="subsubtitle-container">Usuarios</div>
                            <div class="DPU">
                                <label for="addusuario">Altas</label>
                                <input type="checkbox" id="addusuario" name="addusuario">
                            </div>
                            <div class="DPU">
                                <label for="delusuario">Bajas</label>
                                <input type="checkbox" id="delusuario" name="delusuario">
                            </div>
                            <div class="DPU"> 
                                <label for="modusuario">Cambios</label>
                                <input type="checkbox" id="modusuario" name="modusuario">
                            </div>
                            <div class="DPU">   
                                <label for="conusuario">Consultas</label>
                                <input type="checkbox" id="conusuario" name="conusuario">
                            </div>
                        </div>
                        <div class="module-category">
                            <div class="subsubtitle-container">Empleados</div>
                            <div class="DPU">
                                <label for="addempleado">Altas</label>
                                <input type="checkbox" id="addempleado" name="addempleado">
                            </div>
                            <div class="DPU">
                                <label for="delempleado">Bajas</label>
                                <input type="checkbox" id="delempleado" name="delempleado">
                            </div>
                            <div class="DPU"> 
                                <label for="modempleado">Cambios</label>
                                <input type="checkbox" id="modempleado" name="modempleado">
                            </div>
                            <div class="DPU">   
                                <label for="conempleado">Consultas</label>
                                <input type="checkbox" id="conempleado" name="conempleado">
                            </div>
                        </div>
                        <div class="module-category">
                            <div class="subsubtitle-container">Responsivas</div>
                            <div class="DPU">
                                <label for="addresponsiva">Agregar</label>
                                <input type="checkbox" id="addresponsiva" name="addresponsiva">
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
                        <input type="submit" value="Guardar" id="" name="" class="">
                        <input type="submit" value="Cancelar" id="" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)
            })
        }

        function cancel() {
            $('.description-product').html(`
                <div class="actions two-boxes-registro" style="height: 60%;">
                    <center>
                        <button class="options meter FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar Usuarios</button>
                        <button class="options sacar FTB"><i class="fa-solid fa-circle-minus body-icons" style="font-size: 25px;"></i>Agregar Empleado</button>
                    </center>
                </div>`)
            CRUDButtons()
        }

        window.addEventListener('load', function (event) {
            sselect()

            CRUDButtons()
        })


        // // Consulta de productos
        // fetch('/prod_exts', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ username: user })
        // }).then(response => response.json())
        //     .then(data => {
        //         const tbody = document.querySelector(".data-prod tbody");

        //         data.forEach(item => {
        //             let tr = document.createElement('tr');
        //             tr.innerHTML = `
        //             <td>${item.Cod_Barras}</td>
        //             <td>${item.Articulo}</td>
        //                 <td>${item.Existencia}</td>`;

        //             tr.addEventListener('click', () => {
        //                 if ($(`.description-product .DP label:contains('${item.Articulo}')`).length === 0) {
        //                     $(` 
        //                         <div class="DP">
        //                             <label article="${item.Cod_Barras}">${item.Articulo}</label>
        //                             <input autocomplete="off" placeholder="Cantidad" type="number" id="CantidadPE" name="CantidadPE" class="CantidadPE" required min="0">
        //                         </div>
        //                     `).insertBefore('.buttons');
        //                 }
        //             });

        //             tbody.appendChild(tr);
        //         });
        //     })
        //     .catch(error => {
        //         console.error('Error en la solicitud:', error);
        //         document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
        //     });
        }
    }
