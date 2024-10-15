var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/productos_exist" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {

        function agregarPE(e) {
            e.preventDefault()
            let productos = []
            $('.description-product .DP').each(
                function () {
                    let producto = $(this).find('label').attr('article');
                    let cantidad = $(this).find('input[type="number"]').val()

                    if (producto && cantidad) {
                        productos.push({
                            producto: producto,
                            cantidad: cantidad
                        });
                    } else {
                        showErrorAlert('Debes de llenar todos los campos antes de enviar el formulario.')
                    }
                }
            )

            if (productos.length > 0) {
                fetch('/prod_exts/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productos)
                }).then(response => response.json())
                    .then(data => {

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
                    <div class="buttons">
                        <input type="submit" value="Guardar" id="modyEqp" onclick="agregarPE(event)" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)
            })

            $('.sacar').click((e) => {
                addBody(`
                    <div class="DP">
                        <label>Producto</label>
                        <input type="text" class="Pname" value="" readonly>
                    </div>
                    <div class="DP">
                        <label>Código de barras</label>
                        <input type="text" class="CodBarrasP" value="" readonly>
                    </div>
                    <div class="DP">
                        <label>Fecha de Ingreso</label>
                        <input autocomplete="off" type="date" id="FecActu" name="FecActu" required>
                    </div>
                    <div class="DP">
                        <label>Cantidad</label>
                        <input autocomplete="off" type="number" id="CantidadPE" name="CantidadPE" class="CantidadPE" required min="0">
                    </div>
                    <div class="DP">
                        <label>Proveedor</label>
                        <input autocomplete="off" type="text" id="ProveedorPE" name="ProveedorPE" class="EditData" required maxlength="400"
                            oninput="mayus(this);" onkeypress="return checkA(event)" readonly>
                    </div>
                    <div class="DP">
                        <label>Número de Factura</label>
                        <input autocomplete="off" type="text" id="NumFactPE" name="NumFactPE" class="EditData" required maxlength="400"
                            oninput="mayus(this);" onkeypress="return checkL(event)" readonly>
                    </div>
                    <div class="DP">
                        <label>Fecha de Factura</label>
                        <input autocomplete="off" type="date" id="FecFact" name="FecFact">
                    </div>
                    <div class="buttons">
                        <input type="submit" value="Guardar" id="modyEqp" name="modyEqp" class="Modify">
                        <input type="submit" value="Cancelar" id="cancelEqp" onclick="cancel()" name="cancelEqp" class="Cancel">
                    </div>
                    `, e)
            })
        }

        function cancel() {
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
            },
            body: JSON.stringify({ username: user })
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
                        if ($(`.description-product .DP label:contains('${item.Articulo}')`).length === 0) {
                            $(` 
                                <div class="DP">
                                    <label article="${item.Cod_Barras}">${item.Articulo}</label>
                                    <input autocomplete="off" placeholder="Cantidad" type="number" id="CantidadPE" name="CantidadPE" class="CantidadPE" required min="0">
                                </div>
                            `).insertBefore('.buttons');
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