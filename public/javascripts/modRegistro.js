var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

function clearContent() {
    const tbody = document.querySelector(".data-prod tbody");
    const headers = document.getElementById('table-headers');
    const table = document.querySelector(".data-prod");

    // Limpiar las columnas y el contenido de la tabla
    headers.innerHTML = '';
    tbody.innerHTML = '';

    // Ocultar la tabla
    table.style.visibility = "hidden";

    // Opcional: Limpiar cualquier otro formulario o componente que sea necesario
    //$('.description-product .DP').remove(); // Si hay elementos adicionales creados dinámicamente
}


$(document).off('click', '.meter').on('click', '.meter', function(e) {
    clearContent();
    setupEmployeeTable();
});

$(document).off('click', '.sacar').on('click', '.sacar', function(e) {
    clearContent();
    setupUserTable();
});


// Función para mostrar la tabla
function showTable() {
    const table = document.querySelector(".data-prod");
    table.style.visibility = "visible"; // Hacer visible la tabla
}

// Función para agregar las columnas de Modificar Empleado (1, 2, 3)
function setupEmployeeTable() {
    const headers = document.getElementById('table-headers');
    const tbody = document.querySelector(".data-prod tbody");

    // Limpiar las columnas y el contenido anterior
    headers.innerHTML = '';
    tbody.innerHTML = '';

    // Agregar las columnas 1, 2, 3
    headers.innerHTML = `
        <th>Nombre Empleado</th>
        <th>Área</th>
        <th>Jefe</th>
    `;

    // Agregar filas de ejemplo
    let exampleData = [
        { col1: "Dato 1", col2: "Dato 2", col3: "Dato 3" },
        { col1: "Dato A", col2: "Dato B", col3: "Dato C" }
    ];

    // Llenar la tabla con datos de ejemplo
    exampleData.forEach(item => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.col1}</td>
            <td>${item.col2}</td>
            <td>${item.col3}</td>
        `;
        tbody.appendChild(tr);
    });

    showTable(); // Mostrar la tabla
}

// Función para agregar las columnas de Modificar Usuarios (puede ser diferente)
function setupUserTable() {
    const headers = document.getElementById('table-headers');
    const tbody = document.querySelector(".data-prod tbody");

    // Limpiar las columnas y el contenido anterior
    headers.innerHTML = '';
    tbody.innerHTML = '';

    // Agregar otras columnas si es necesario (ejemplo: A, B, C)
    headers.innerHTML = `
        <th>Nombre Empleado</th>
        <th>Usuario</th>
    `;

    // Agregar filas de ejemplo
    let exampleData = [
        { colA: "Usuario 1", colB: "Usuario 2" },
        { colA: "Admin A", colB: "Admin B"}
    ];

    // Llenar la tabla con datos de ejemplo
    exampleData.forEach(item => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.colA}</td>
            <td>${item.colB}</td>
        `;
        tbody.appendChild(tr);
    });

    showTable(); // Mostrar la tabla
}


if (!Permisos['EMPLEADOS'] && !Permisos['USUARIOS']) {
    location.href = "index";
} else {
    if (pathname == "/users/modReg" && (Permisos['EMPLEADOS'].includes('3'))){

        function sacarPE(e) {
            e.preventDefault()

            let productos = obtenerP()
            let encargado = $('.Employees').val()

            if (productos.length > 0) {
                fetch('/prod_exts/extract', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ encargado, productos })
                }).then(response => response.json())
                    .then(data => {
                        if (data.type == "Success") {
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

        function agregarPE(e) {
            e.preventDefault()

            let factura = $('.NumFactPE').val()
            let Dfactura = $('.FecFact').val()
            let Proveedor = $('.ProveedorPE').val()

            let productos = obtenerP()

            if (productos.length > 0) {
                fetch('/prod_exts/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ factura, Dfactura, Proveedor, productos })
                }).then(response => response.json())
                    .then(data => {
                        if (data.type == "success") {
                            showSuccessAlertReload(data.message)
                        } else {
                            showErrorAlertReload(data.message, '/users/productos_exist')
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                    });
            } else {
                showErrorAlert('No hay productos para enviar.');
            }


        }

        function cancel() {
            clearContent();
        
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
        
        // Inicializar los eventos de los botones al cargar la página
        window.addEventListener('load', function (event) {
            sselect(); // Si esta función es necesaria para la selección
            CRUDButtons(); // Asignar los eventos al cargar la página
        });
        


        // Consulta de productos
        fetch('/prod_exts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-prod tbody");

                data.forEach(item => {
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.Cod_Barras}</td>
                    <td>${item.Articulo}</td>
                        <td>${item.Existencia}</td>`;

                    tr.addEventListener('click', () => {
                        const selector = `.description-product .DP label[article='${item.Cod_Barras}']`;

                        if ($(selector).length === 0) {
                            $(`
                                <div class="DP prod-count">
                                <label article="${item.Cod_Barras}">${item.Articulo}</label>
                                <input autocomplete="off" placeholder="Cantidad" type="number" id="CantidaDFE" name="CantidaDFE" class="CantidaDFE" required min="0">
                                </div>
                                `).insertBefore('.buttons');
                        } else {
                            $(selector).closest('.prod-count').remove();
                        }
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