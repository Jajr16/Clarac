var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');
var area = localStorage.getItem('area');

if (area !== 'DIRECCION GENERAL') {
    window.location.href = "home";
} else {

    function colortable() {
        const tbodyProd = document.querySelector(".peti-table tbody");
        const tbodyAcept = document.querySelector(".peti-acept tbody");

        tbodyProd.querySelectorAll('tr').forEach(tr => {
            tr.addEventListener('click', () => {
                const articleValue = tr.getAttribute('article'); // Asegúrate de que cada tr en la tabla tenga este atributo

                // Verificar si hay un tr en peti-acept que tenga el mismo article
                const matchingRow = [...tbodyAcept.querySelectorAll('tr')].find(row => row.getAttribute('article') === articleValue);

                // Cambiar el color de fondo en función de si se encontró o no un match
                if (matchingRow) {
                    tr.style.backgroundColor = '#b0c9ff'; // Si hay coincidencia
                } else {
                    tr.style.backgroundColor = ''; // Si no hay coincidencia
                }
            });
        });
    }

    function cancel(e) {
        e.preventDefault()
        $('.principalContent').remove()
        $(`
        <div class="two-boxes One-item-dir">
            <center>
                <button class="options action-peti FTB" style="margin-right: 1rem;"><i
                        class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Solicitudes pendientes</button>
                <button class="options status FTB"><i class="fa-solid fa-circle-minus body-icons"
                        style="font-size: 25px;"></i>Estatus de solicitudes</button>
            </center>
        </div>
        `).insertAfter('.content-container');
        $('.one-button').remove()
        $('.content-container').remove();
        CRUDButtons()
        // REESTABLECER EL DIV DEL TÍTULO PARA EL CENTRADO Y AJUSTE DEL DIV
        document.body.style.height = '90%'
        document.querySelector('.boxes-containers').style.width = '50%'
    }

    function enabledStructure() {
        // ESTABLECER EL TAMAÑO DEL DIV DEL TÍTULO AL LARGO COMPLETO DEL DIV Y AJUSTAR EL ALTO DEL MISMO
        document.body.style.height = 'auto'
        document.querySelector('.boxes-containers').style.width = '90%'

        // EMPEZAR CON LA INSERCIÓN DE TODAS LAS TABLAS, DIVS DE LAS ACCIONES DE LAS PETICIONES
        $('.One-item-dir').remove() // Quitar los dos botones principales de la página

        // Agregar el buscador de las tablas después del título del div principal
        $(`
        <div class="content-container">
            <div class="FTB">
                <input type="text" class="buscar" id="buscar" oninput="buscarTable(); mayus(this);"
                    placeholder="BUSCAR EN TABLA" title="Empieza a escribir para buscar" autocomplete="off">
            </div>
        </div>    
        `).insertAfter(`.title-container`)

        $(`
            <div class='one-button DP'>
                <input type="submit" value="Cancelar" id="cancelEqp" class="Cancel" onclick="cancel(event)">
            </div>
        `).insertAfter('.principalContent')
    }

    // Función para agregarles eventos a los dos botones principales de la página
    function CRUDButtons() {
        $('.action-peti').click(e => {
            e.preventDefault() // Evitar envío de formulario
            /* Agregar toda la estructura principal para visualizar tanto la tabla de peticiones como la tabla que contendrá las peticiones 
        a manipular.
        Esto se insertará después del div del título */
            $(`
            <div class="Columns principalContent">
                <div class="table-responsive item1" style="flex: 1 1 45%;">
                </div>
                <div class="boxes-containers item2 data">
                    <div class="subtitle-container">
                        Gestión de solicitudes
                    </div>
    
                    <form method="POST" enctype="multipart/form-data" style="height: 100%;" class="Peticiones">
                        <div class="description-product" style="height: 100%;">
                        </div>
                    </form>
                </div>
            </div>            
            `).insertAfter('.Fone-item')
            enabledStructure()

            fetch('/pet/consulSol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.type === "success" || data.type === "Success") {
                        $('.item1').html(`
                        <table class="data-prod info-table peti-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Solicitante</th>
                                    <th>Fecha de solicitud</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>        
                    `);

                        $('.description-product').html(`
                        <table class='peti-acept'>
                            <thead>
                                <tr>
                                    <th>Articulo</th>
                                    <th>Cantidad</th>
                                    <th>Solicitante</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>    
                    `);
                        const tbody = document.querySelector(".peti-table tbody");
                        const tbodyacept = document.querySelector(".peti-acept tbody");

                        data.dataToSend.forEach(item => {
                            let tr = document.createElement('tr');
                            let date = normalizeDate(item.fecha);

                            tr.innerHTML = `
                            <td>${item.Arti}</td>
                            <td>${item.Cantidad}</td>
                            <td>${item.Nom}</td>
                            <td>${date}</td>
                            `;
                            tr.setAttribute('article', `${item.Cod_Barras}_${item.Cantidad}_${date}_${item.Nom}`);

                            tr.addEventListener('click', () => {
                                const trAceptSelector = `.peti-acept tbody tr[article='${item.Cod_Barras}_${item.Cantidad}_${date}_${item.Nom}']`;

                                if (document.querySelector(trAceptSelector) === null) {
                                    let trData = document.createElement('tr');
                                    trData.setAttribute('article', `${item.Cod_Barras}_${item.Cantidad}_${date}_${item.Nom}`);
                                    trData.classList.add('data-pet');

                                    trData.innerHTML = `
                                        <td>${item.Arti}</td>
                                        <td>${item.Cantidad}</td>
                                        <td>${item.Nom}</td>
                                    `;
                                    tbodyacept.appendChild(trData);
                                } else {
                                    document.querySelector(trAceptSelector).remove();
                                }
                                
                                if (tbodyacept && tbodyacept.children.length !== 0) {
                                    // Verificar si los botones ya están presentes
                                    if (document.querySelector('.buttons') === null) {
                                        function petConfirm(e, op) {
                                            e.preventDefault()

                                            const tbodyacept = document.querySelector(".peti-acept tbody");
                                            const selectedItems = [...tbodyacept.querySelectorAll('tr')].map(tr => {
                                                return {
                                                    Cod_Barras: tr.getAttribute('article').split('_')[0],
                                                    empleado: tr.querySelector('td:nth-child(3)').innerText,
                                                    fecha: tr.getAttribute('article').split('_')[2]
                                                };
                                            });

                                            Swal.fire({
                                                title: "¿Estás seguro?",
                                                text: op === 1 ? "Estás a punto de aceptar las peticiones seleccionadas, esta acción no se puede revertir."
                                                    : "Estás a punto de denegar las peticiones seleccionadas, esta acción no se puede revertir.",
                                                icon: "warning",
                                                showCancelButton: true,
                                                cancelButtonText: "Cancelar",
                                                confirmButtonText: "Continuar",
                                                confirmButtonColor: "#001781",
                                                cancelButtonColor: 'rgb(134, 0, 0)'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    fetch('/pet/confirmPetDir', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ selectedItems, op })
                                                    })
                                                        .then(response => response.json())
                                                        .then(data => {
                                                            if (data.type == "success" || data.type == "Success") {
                                                                showSuccessAlertReload(data.message)
                                                            } else {
                                                                showErrorAlert(data.message)
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error('Error en la solicitud:', error);
                                                            document.getElementById('errorMessage').innerText = `Error en el servidor. 
                                                            Por favor, inténtelo de nuevo más tarde.`;
                                                        });
                                                }
                                            })
                                        }

                                        // Crear contenedor de botones
                                        const buttonsDiv = document.createElement('div');
                                        buttonsDiv.classList.add('DP', 'buttons');

                                        // Botón Guardar
                                        const saveButton = document.createElement('input');
                                        saveButton.type = 'submit';
                                        saveButton.value = 'Aceptar';
                                        saveButton.id = 'modyEqp';
                                        saveButton.className = 'Modify';
                                        saveButton.onclick = (event) => petConfirm(event, 1);

                                        const denyButton = document.createElement('input');
                                        denyButton.type = 'submit';
                                        denyButton.value = 'Denegar';
                                        denyButton.id = 'modyEqp';
                                        denyButton.className = 'Deny';
                                        denyButton.onclick = (event) => petConfirm(event, 0);

                                        // Agregar botones al contenedor y luego al DOM
                                        buttonsDiv.appendChild(saveButton);
                                        buttonsDiv.appendChild(denyButton);
                                        document.querySelector('.description-product').after(buttonsDiv);
                                    }
                                } else {
                                    document.querySelector('.buttons').remove();
                                }
                            });

                            tbody.appendChild(tr);
                            empty_table('peti-table', 4)
                        });
                        colortable();

                        $('.description-product').addClass('table-responsive-box');
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                });
        })

        $('.status').click(e => {
            e.preventDefault()
            function initStatus() {
                fetch('/pet/viewStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user })
                })
                    .then(response => response.json())
                    .then(data => {

                        const tbody = document.querySelector('.status-peti tbody');
                        tbody.innerHTML = "";
                        data.dataToSend.forEach(item => {
                            let tr = document.createElement('tr');
                            let date = normalizeDate(item.fecha);

                            tr.innerHTML = `
                                <td>${date}</td>
                                <td>${item.Arti}</td>
                                <td>${item.Cantidad}</td>
                                <td>${item.Nombre}</td>
                                <td>${item.Estatus}</td>
                                `

                            tbody.appendChild(tr)
                            empty_table('status-peti', 5)
                        })
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                    });
            }
            $(`
                <div class="globalColumn principalContent">
                    <div class="table-responsive item1" style="justify-content: center; align-items: center;">
                        <table class="data-prod info-table status-peti">
                            <thead>
                                <tr>
                                    <th>Fecha de solicitud</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Solicitante</th>
                                    <th>Estatus</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                    <i class="fa-solid fa-clock-rotate-left body-icons History" style="font-size: 25px;" data-history="true"></i>
                </div>            
            `).insertAfter('.Fone-item')

            $('.History').click(() => {
                const icon = $('.fa-clock-rotate-left');
                if (icon.attr('data-history') === 'true') { 
                    // Ver Historial
                    fetch('/pet/viewHistory', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ user })
                    })
                        .then(response => response.json())
                        .then(data => {
                            const tbody = document.querySelector('.status-peti tbody');
                            tbody.innerHTML = "";

                            data.dataToSend.forEach(item => {
                                let tr = document.createElement('tr');
                                let date = normalizeDate(item.fecha);

                                tr.innerHTML = `
                                <td>${date}</td>
                                <td>${item.Arti}</td>
                                <td>${item.Cantidad}</td>
                                <td>${item.Nombre}</td>
                                <td>${item.Estatus}</td>
                                `;

                                tbody.appendChild(tr);
                            });
                            empty_table('status-peti', 5)
                            // Cambia a estado de "actual"
                            icon.attr('data-history', 'false');
                        })
                        .catch(error => {
                            console.error('Error en la solicitud:', error);
                            document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                        });
                } else {
                    // Ver Estado Actual
                    initStatus();
                    icon.attr('data-history', 'true');
                }
            });

            enabledStructure()
            document.querySelector('.item1').style.marginRight = 0;
            document.querySelector('.table-responsive').style.display = 'grid';
            initStatus()
        })
    }

    window.addEventListener('DOMContentLoaded', function () {
        CRUDButtons()
    })
}