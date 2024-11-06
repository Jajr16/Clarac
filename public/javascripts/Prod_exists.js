var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/productos_exist" && (Permisos['ALMACÉN'].includes('4') && Permisos['ALMACÉN'].includes('2') && Permisos['ALMACÉN'].includes('1') && Permisos['ALMACÉN'].includes('3'))) {

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

        function CRUDButtons() {
            $('.meter').click((e) => {
                addBody(`
                    <div class="global_data">
                        <div class="DP">
                            <label>Fecha de Factura</label>
                            <input autocomplete="off" type="date" id="FecFact" name="FecFact" class="FecFact" required>
                        </div>
                        <div class="DP">
                            <input autocomplete="off" placeholder="Número de factura" type="text" id="NumFactPE" name="NumFactPE" class="EditData NumFactPE" required maxlength="400"
                                oninput="mayus(this);" onkeypress="return checkA(event)">
                            <input autocomplete="off" placeholder="Proveedor" type="text" id="ProveedorPE" name="ProveedorPE" class="EditData ProveedorPE" required maxlength="400"
                                oninput="mayus(this);" onkeypress="return checkA(event)">
                        </div>
                    </div>
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" onclick="agregarPE(event)" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)

                colortable();
            })

            $('.sacar').click((e) => {
                addBody(`
                    <div class="global_data">
                        <div class="DP">
                            <label>Solicitante:</label>
                            <select id="mySelect" class="Employees searchInput" required>
                                <option disabled selected>Seleccionar empleado...</option>
                            </select>
                        </div>
                    </div>
                    <div class="DP buttons">
                        <input type="submit" value="Guardar" id="modyEqp" onclick="sacarPE(event)" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)

                colortable();

                const employ = $('.Employees')

                fetch('../responsiva/getEmploys', {
                    method: 'GET'
                })
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(item => {
                            employ.append($('<option>', { value: item.employee, text: item.employee }))
                        })
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                    });

                new SlimSelect({
                    select: employ[0]
                });
            })
        }

        function cancel() {
            const tbody = document.querySelector(".data-prod tbody");
            tbody.querySelectorAll('tr').forEach(tr => {
                tr.style.backgroundColor = '';
            });

            $('.description-product').html(`
                <div class="actions two-boxes" style="height: 60%;">
                    <center>
                        <button class="options meter FTB" style="margin-right: 1rem;"><i class="fa-solid fa-circle-plus body-icons" style="font-size: 25px;"></i>Agregar productos al stock</button>
                        <button class="options sacar FTB"><i class="fa-solid fa-circle-minus body-icons" style="font-size: 25px;"></i>Sacar productos del stock</button>
                    </center>
                </div>`)
            CRUDButtons()
        }

        window.addEventListener('load', function (event) {
            sselect()

            CRUDButtons()
        })


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