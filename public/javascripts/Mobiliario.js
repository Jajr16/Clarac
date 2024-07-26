var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['MOBILIARIO']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('1') || Permisos['MOBILIARIO'].includes('3'))) {
        function addFurniture(e) {
            e.preventDefault()
            const updatedData = {
                Articulo: document.querySelector('.Fname').value,
                Cantidad: document.querySelector('.CantidadM').value,
                Ubicacion: document.querySelector('.UbiM').value,
                Descripcion: document.querySelector('.DescM').value,
                User: user
            };
            fetch('/new_mob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            }).then(response => response.json())
                .then(data => {
                    if (data.type === 'Mobiliario_Respuesta') {
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

        var ImageFunction = function () {
            inputFile.click();
        }

        // IMAGEN
        document.addEventListener('DOMContentLoaded', function () {
            const inputFile = document.getElementById('inputFile');
            const addF = $('.fa-circle-plus')
            addF.click(function () {
                const inputM = $('.EditDataM');
                const image = $('.furniture-image')

                image.css('cursor', 'pointer')
                inputM.attr("readonly", false);
                inputM.attr("placeholder", 'Ingresa los datos del mobiliario');
                inputM.val('')

                var add = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="addFurniture(event)" class="modyMob">`;
                var cancel = '<input type="submit" value="Cancelar" id="cancelMob" onclick="dissapear()" name="cancelMob" class="cancelMob">';
                $('.modyMob').remove();
                $('.cancelMob').remove();
                $('.buttons').append(add);
                $('.buttons').append(cancel);

                const edit = $('.editM');
                edit.css('display', 'none')
                const imagen = document.getElementsByClassName('furniture-image')[0];

                imagen.addEventListener('click', ImageFunction);

                inputFile.addEventListener('change', function () {
                    if (inputFile.files.length > 0) {
                        const articulo = document.querySelector('.Fname').value;
                        const descripcion = document.querySelector('.DescM').value;

                        addImage(inputFile, articulo, descripcion);
                    }
                });
            })

        });

        function dissapear() {
            const inputM = $('.EditDataM')
            const imagen = document.getElementsByClassName('furniture-image')[0];

            inputM.attr("placeholder", '')
            inputM.attr("readonly", true)
            $('.modyMob').remove()
            $('.cancelMob').remove()
            $('.fa-circle-plus').css('display', 'block')

            imagen.removeEventListener('click', ImageFunction);
            imagen.style.cursor = 'default';
            const edit = $('.editM');
            edit.css('display', 'block')
        }

        function modify(oldName, oldDesc, e) {
            e.preventDefault()
            const updatedData = {
                Articulo: document.querySelector('.Fname').value,
                Cantidad: document.querySelector('.CantidadM').value,
                Ubicacion: document.querySelector('.UbiM').value,
                Descripcion: document.querySelector('.DescM').value,
                dataOldA: oldName,
                dataOldD: oldDesc,
                user
            };

            fetch('/mod_mob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            }).then(response => response.json())
                .then(data => {
                    if (data.type === 'RespDelMob') {
                        showSuccessAlertReload(data.message)
                    } else {
                        showErrorAlert(data.message)
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                });

            const data = {
                type: 'Cambios_Mobiliario',
                data: updatedData,
            };
            sendWebSocketMessage(data)
            ws.onmessage = handleSocketResponse;
        }
        // FUNCIONALIDAD PÁGINA
        const edit = $('.editM');

        edit.click(function (e) {
            var nombre_Articulo = $('.Fname').val();
            var desc_Articulo = $('.DescM').val();
            const inputM = $('.EditDataM');
            const image = $('.furniture-image')

            image.css('cursor', 'pointer')
            inputM.attr("readonly", false);
            var modify = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="modify('${nombre_Articulo}', '${desc_Articulo}', event)" class="modyMob">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelMob" onclick="dissapear()" name="cancelMob" class="cancelMob">';
            $('.modyMob').remove();
            $('.cancelMob').remove();
            $('.fa-circle-plus').css('display', 'none')
            $('.buttons').append(modify);
            $('.buttons').append(cancel);

            const imagen = document.getElementsByClassName('furniture-image')[0];

            imagen.addEventListener('click', ImageFunction);

            inputFile.addEventListener('change', function () {
                if (inputFile.files.length > 0) {
                    const articulo = document.querySelector('.Fname').value;
                    const descripcion = document.querySelector('.DescM').value;

                    addImage(inputFile, articulo, descripcion);
                }
            });
        });

        fetch('/Mobiliario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-mob tbody");

                data.forEach(item => {
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${item.Articulo}</td>
            <td>${item.Cantidad}</td>
        `;

                    tr.addEventListener('click', () => {
                        if ($('.fa-pencil-square-o').css('visibility', 'hidden')) {
                            $('.fa-pencil-square-o').css('visibility', 'visible');
                            const inputM = $('.EditDataM');
                            inputM.attr("readonly", true);
                            $('.modyMob').remove();
                            $('.cancelMob').remove();
                        }
                        if ($('.editM').css('display', 'none')) {
                            $('.editM').css('display', 'block')
                        }
                        if ($('.fa-circle-plus').css('display', 'none')) {
                            $('.fa-circle-plus').css('display', 'block')
                        }
                        $('.Fname').val(item.Articulo);
                        $('.UbiM').val(item.Ubicacion);
                        $('.CantidadM').val(item.Cantidad);
                        $('.DescM').val(item.Descripcion);

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
