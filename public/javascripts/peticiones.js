var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['PETICIONES']) {
    location.href = "index";
} else {
    if ((pathname == "/users/peticiones" || pathname == "/users/Peticiones") && (Permisos['PETICIONES'].includes('1'))) {
        function agregarPet(e) {
            e.preventDefault()

            let productos = obtenerP()

            fetch('/pet/addPet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, productos })
            }).then(response => response.json())
                .then(data => {
                    if (data.type == "success" || data.type == "Success") {
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

        function cancel(e) {
            e.preventDefault()
            $('.Cancel').remove()
            $('.description-product').html(`
                <div class="actions two-boxes" style="height: 60%;">
                    <center>
                        <button class="options status FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Estatus de peticiones</button>
                        <button class="options peti FTB"><i class="fa-solid fa-circle-minus body-icons" style="font-size: 25px;"></i>Solicitar productos</button>
                    </center>
                </div>`)
            CRUDButtons()

            const tbody = document.querySelector(".data-prod tbody");
            tbody.querySelectorAll('tr').forEach(tr => {
                tr.style.backgroundColor = '';
            });

            $('.description-product').removeClass('table-responsive-box')
        }

        function CRUDButtons() {
            $('.status').click((e) => {
                e.preventDefault()
                fetch('/pet/status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user })
                }).then(response => response.json())
                    .then(data => {
                        if (data.type == "success" || data.type == "Success") {
                            $('.description-product').html(`
                                <table class="data-prod info-table peti-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Estatus</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>        
                            `)

                            const tbody = document.querySelector(".peti-table tbody");
                            data.dataToSend.forEach(item => {
                                let tr = document.createElement('tr');

                                tr.innerHTML = `
                                    <td>${item.Arti}</td>
                                    <td>${item.Cantidad}</td>
                                    <td>${item.Enviado}</td>
                                `
                                console.log(item.Enviado)
                                if (item.Enviado !== 'Solicitud rechazada' &&
                                    item.Enviado !== 'Artículo recibido, esperando confirmación del almacenista.' &&
                                    item.Enviado !== 'Entrega completa.' && 
                                    item.Enviado !== 'En espera de confirmación') {

                                    tr.addEventListener('click', () => {
                                        Swal.fire({
                                            title: '¿Ya recibiste este producto?',
                                            text: 'Confirma la operación en caso de ya haber recibido el producto que pediste.',
                                            icon: "warning",
                                            cancelButtonText: "Cancelar",
                                            confirmButtonText: `Si, ya recibí el artículo: ${item.Arti}`,
                                            showCancelButton: true,
                                            confirmButtonColor: "#001781",
                                            cancelButtonColor: 'rgb(134, 0, 0)'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                fetch('/pet/Solicitante', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({ user, Cod_Barras: item.Cod_Barras, fecha: item.fecha })
                                                })
                                                    .then(response => response.json())
                                                    .then(data => {
                                                        if (data.type == "success" || data.type == "Success") {
                                                            showSuccessAlertReload(data.message)
                                                        } else if (data.type == 'failed') {
                                                            Swal.fire({
                                                                icon: "error",
                                                                title: 'Ups!!!.',
                                                                text: data.message,
                                                            });
                                                        } else {
                                                            showErrorAlert(data.message)
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error('Error en la solicitud:', error);
                                                        document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                                                    });
                                            }
                                        })
                                    })
                                }

                                tbody.appendChild(tr)
                            });
                            $('.description-product').addClass('table-responsive-box')
                            $('<input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel(event)" style="width: 100%;" name="cancelEqp" class="Cancel">')
                                .insertAfter(`
                                .description-product
                            `)
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                    });

                colortable();
            })

            $('.peti').click((e) => {
                e.preventDefault()
                addBody(`
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" onclick="agregarPet(event)" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel(event)" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)

                colortable();
            })
        }

        // Consulta de productos
        fetch('../prod_exts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-prod tbody");
                const selProd = $('.Prod')

                if (data.length <= 0) {
                    empty_table()
                }

                data.forEach(item => {
                    let tr = document.createElement('tr');

                    if (item.Eliminado !== 1) {
                        selProd.append($('<option>', { value: item.Articulo, text: item.Articulo }))

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

                        $('.Prod').change(function () {
                            if ($(this).val() === item.Articulo) {
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
                            }
                        });

                        tbody.appendChild(tr);
                    }
                });
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });

        window.addEventListener('load', function (event) {
            sselect()
            CRUDButtons()
        })
    }
}