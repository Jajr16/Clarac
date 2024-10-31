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
                console.log(articleValue)
                // Verificar si hay un tr en peti-acept que tenga el mismo article
                const matchingRow = [...tbodyAcept.querySelectorAll('tr')].find(row => row.getAttribute('article') === articleValue);
                console.log(matchingRow)
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

        const tbodyacept = document.querySelector(".peti-acept tbody");
        tbodyacept.innerHTML = ''
        document.querySelector('.buttons').remove();
        const tbody = document.querySelector(".data-prod tbody");
        tbody.querySelectorAll('tr').forEach(tr => {
            tr.style.backgroundColor = '';
        });
    }
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

                                // Botón Cancelar
                                const cancelButton = document.createElement('input');
                                cancelButton.type = 'submit';
                                cancelButton.value = 'Cancelar';
                                cancelButton.id = 'cancelEqp';
                                cancelButton.className = 'Cancel';
                                cancelButton.onclick = (event) => cancel(event);

                                // Agregar botones al contenedor y luego al DOM
                                buttonsDiv.appendChild(saveButton);
                                buttonsDiv.appendChild(denyButton);
                                buttonsDiv.appendChild(cancelButton);
                                document.querySelector('.description-product').after(buttonsDiv);
                            }
                        } else {
                            document.querySelector('.buttons').remove();
                        }
                    });

                    tbody.appendChild(tr);
                });
                colortable();

                $('.description-product').addClass('table-responsive-box');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
        });
}