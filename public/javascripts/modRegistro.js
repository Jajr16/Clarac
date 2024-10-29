var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

function clearContent() {
    const tbody = document.querySelector(".data-prod tbody");
    const headers = document.getElementById('table-headers');
    const table = document.querySelector(".data-prod");

    headers.innerHTML = '';
    tbody.innerHTML = '';
    table.style.visibility = "hidden";
}

$(document).off('click', '.meter').on('click', '.meter', function(e) {
    clearContent();
    obtenerRegistrosEmpleados();
});

$(document).off('click', '.sacar').on('click', '.sacar', function(e) {
    clearContent();
    obtenerRegistrosUsuarios();
});

// Función para mostrar la tabla
function showTable() {
    const table = document.querySelector(".data-prod");
    table.style.visibility = "visible"; // Hacer visible la tabla
}

if (!Permisos['EMPLEADOS'] && !Permisos['USUARIOS']) {
    location.href = "index";
} else {
    if (pathname == "/users/modReg" && (Permisos['EMPLEADOS'].includes('3'))){

        function modify(oldNum_Serie, e) {

            e.preventDefault()
            const updatedData = {

                Num_Serie: document.querySelector('.NumSerieE').value,
                Equipo: document.querySelector('.Ename').value,
                Marca: document.querySelector('.MarcaE').value,
                Modelo: document.querySelector('.ModeloE').value,
                Ubi: document.querySelector('.UbiE').value,
                dataOldNS: oldNum_Serie,
                User: user

            };

            if (Asignacion && Asignacion.val().trim() !== '') {
                updatedData.Num_Serie_CPU = Asignacion.val()
            }

            if (Hardware && Hardware.val().trim() !== '') {
                updatedData.Hardware = Hardware.val()
            }

            if (Software && Software.val().trim() !== '') {
                updatedData.Software = Software.val()
            }

            if (Mouse && Mouse.val().trim() !== '') {
                updatedData.Mouse = Mouse.val()
            }

            if (Teclado && Teclado.val().trim() !== '') {
                updatedData.Teclado = Teclado.val()
            }

            if (Accesorio && Accesorio.val().trim() !== '') {
                updatedData.Accesorio = Accesorio.val()
            }

            if (Asignacion.val() !== '' || Asignacion.val() !== null || Asignacion.val() || undefined) {
                updatedData.Num_Serie_CPU = Asignacion.val()
            }

            fetch('/equipo/mod_eqp', {
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
        const edit = $('.edit');

        edit.click(function (e) {

            var Num_Serie = $('.NumSerieE').val();

            var modify = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="modify('${Num_Serie}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear()" name="cancelEqp" class="Cancel">';

            editsFunctions(modify, cancel)
        });

        fetch('/equipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-eqp tbody");
                const selEqp = $('.Eqp')

                if (data.length <= 0) {
                    empty_table()
                }

                data.forEach(item => {
                    selEqp.append($('<option>', { value: item.Num_Serie, text: item.Num_Serie }))

                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.Num_Serie}</td>
                    <td>${item.Equipo}</td>
                    `;

                    selEqp.change(function () {
                        if ($(this).val() === item.Num_Serie) {
                            iconsLogic()
                            $('.NumSerieE').val(item.Num_Serie);
                            $('.Ename').val(item.Equipo);
                            $('.MarcaE').val(item.Marca);
                            $('.ModeloE').val(item.Modelo);
                            $('.UbiE').val(item.Ubi);
                            $('.AsignCPU').val('')
                            $('.Hardware').val('')
                            $('.Software').val('')
                            $('.Mouse').val('')
                            $('.Teclado').val('')
                            $('.Accesorio').val('')

                            if (item.Num_Serie_CPU) {
                                $('.AsignCPU').val(item.Num_Serie_CPU)
                            }

                            if (item.Hardware) {
                                $('.Hardware').val(item.Hardware)
                            }

                            if (item.Software) {
                                $('.Software').val(item.Software)
                            }

                            if (item.Mouse) {
                                $('.Mouse').val(item.Mouse)
                            }

                            if (item.Teclado) {
                                $('.Teclado').val(item.Teclado)
                            }

                            if (item.Accesorio) {
                                $('.Accesorio').val(item.Accesorio)
                            }

                            if (item.Equipo === 'CPU') {
                                Components.slideDown()
                            } else {
                                Components.slideUp()
                            }

                            if (item.Equipo === 'MONITOR') {
                                div_Asignacion.slideDown()
                            } else {
                                div_Asignacion.slideUp()
                            }
                        }
                    })

                    tr.addEventListener('click', () => {

                        $('.NumSerieE').val(item.Num_Serie);
                        $('.Ename').val(item.Equipo);
                        $('.MarcaE').val(item.Marca);
                        $('.ModeloE').val(item.Modelo);
                        $('.UbiE').val(item.Ubi);
                        $('.AsignCPU').val('')
                        $('.Hardware').val('')
                        $('.Software').val('')
                        $('.Mouse').val('')
                        $('.Teclado').val('')
                        $('.Accesorio').val('')

                        iconsLogic()

                        if (item.Num_Serie_CPU) {
                            $('.AsignCPU').val(item.Num_Serie_CPU)
                        }

                        if (item.Hardware) {
                            $('.Hardware').val(item.Hardware)
                        }

                        if (item.Software) {
                            $('.Software').val(item.Software)
                        }

                        if (item.Mouse) {
                            $('.Mouse').val(item.Mouse)
                        }

                        if (item.Teclado) {
                            $('.Teclado').val(item.Teclado)
                        }

                        if (item.Accesorio) {
                            $('.Accesorio').val(item.Accesorio)
                        }

                        if (item.Equipo === 'CPU') {
                            Components.slideDown()
                        } else {
                            Components.slideUp()
                        }

                        if (item.Equipo === 'MONITOR') {
                            div_Asignacion.slideDown()
                        } else {
                            div_Asignacion.slideUp()
                        }
                    });

                    tbody.appendChild(tr);
                });
                sselect()
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });

        function cancel() {
            // clearContent();
        
            // Restaurar el contenido inicial de los botones
            $('.description-product').html(`
                <div class="actions two-boxes" style="height: 60%;">
                    <center>
                        <button class="options meter FTB" style="margin-right: 1rem;"><i
                                class="fa fa-pencil-square-o edit" style="font-size: 25px;"></i>Modificar Empleado</button>
                        <button class="options sacar FTB"><i class="fa fa-pencil-square-o edit"
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
                addBody(`
                    <div class="global_data">
                        <div class="DP">
                            <label>Empleado</label>
                            <input autocomplete="off" id="FecFact" name="FecFact" class="FecFact" required readonly>
                        </div>
                        <div class="DP">
                            <label>Área</label>
                            <select id="" class="EditSelect" name="" required disabled></select>
                        </div>
                        <div class="DP">
                            <label>Jefe</label>
                            <select id="" class="EditSelect" name="" required disabled></select>
                        </div>
                    </div>
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" onclick="agregarPE(event)" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                `, e);
        
                colortable();
            });
        
            // Evento de clic en el botón "Sacar productos"
            $('.sacar').click((e) => {
                addBody(`
                    <div class="global_data">
                        <div class="DP">
                            <label>Empleado Asignado</label>
                            <select id="" class="EditSelect" name="" required disabled></select>
                        </div>
                        <div class="DP">
                            <label>Nombre Usuario</label>
                            <input autocomplete="off" id="FecFact" name="FecFact" class="FecFact" required readonly>
                        </div>
                        <div class="DP">
                            <label>Contraseña Nueva</label>
                            <input autocomplete="off" id="FecFact" name="FecFact" class="FecFact" required readonly>
                        </div>
                    </div>
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" onclick="sacarPE(event)" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                `, e);
        
                colortable();
        
                const employ = $('.Employees');
        
                fetch('../responsiva/getEmploys', {
                    method: 'GET'
                })
                .then(response => response.json())
                .then(data => {
                    data.forEach(item => {
                        employ.append($('<option>', { value: item.employee, text: item.employee }));
                    });
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
                });
        
                new SlimSelect({
                    select: employ[0]
                });
            });
        }
        // Función para obtener los datos de los usuarios y mostrarlos en la tabla
        function obtenerRegistrosUsuarios() {
            fetch('/registro/getRegistrosUsuarios')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector(".data-prod tbody");
                    const headers = document.getElementById('table-headers');
        
                    // Limpiar cualquier contenido existente
                    headers.innerHTML = '';
                    tbody.innerHTML = '';
        
                    // Configurar los encabezados de la tabla solo para Nombre y Usuario
                    headers.innerHTML = `
                        <th>Nombre</th>
                        <th>Usuario</th>
                    `;
        
                    // Llenar la tabla con los datos obtenidos
                    data.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.nombre || 'N/A'}</td>
                            <td>${item.usuario}</td>
                        `;
                        tbody.appendChild(tr);
                    });
        
                    // Mostrar la tabla
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
        
                    // Limpiar cualquier contenido existente
                    headers.innerHTML = '';
                    tbody.innerHTML = '';
        
                    // Configurar los encabezados de la tabla solo para Nombre y Usuario
                    headers.innerHTML = `
                        <th>Nombre</th>
                        <th>Área</th>
                    `;
        
                    // Llenar la tabla con los datos obtenidos
                    data.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${item.nombre || 'N/A'}</td>
                            <td>${item.area}</td>
                        `;
                        tbody.appendChild(tr);
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
        window.addEventListener('load', obtenerRegistrosUsuarios);
        window.addEventListener('load', function (event) {
            sselect(); 
            CRUDButtons(); 
        });

    }
}   