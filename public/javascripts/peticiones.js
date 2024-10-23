const { application } = require("express");

var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/peticiones" && (Permisos['ALMACÉN'].includes('4') || Permisos['ALMACÉN'].includes('2') || Permisos['ALMACÉN'].includes('1') || Permisos['ALMACÉN'].includes('3'))) {
        function agregarPet(e){
            e.preventDefault() 
            
            let productos = obtenerP()

            fetch('/pet/addPet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user, productos})
            }).then(response => response.json())
                .then(data => {
                    if (data.type == "Success") {
                        showSuccessAlertReload(data.message)
                    }else {
                        showErrorAlert(data.message)
                    }
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

                        const selector = `.description-product .DP label[article='${item.Cod_Barras}']`;
                        const button = '.description-product .buttons'
                        tr.addEventListener('click', () => {

                            if ($(selector).length === 0) {
                                if ($(button).length === 0){
                                    $(`.description-product`).append(`
                                        <div class="DP buttons">
                                            <input type="submit" value="Guardar" id="modyEqp" style="width: 100%;" onclick="agregarPet(event)" name="modyEqp"
                                            class="Modify">
                                        </div>
                                    `);
                                }
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
            colortable();
        })
    }
}