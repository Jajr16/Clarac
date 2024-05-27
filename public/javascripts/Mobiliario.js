var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['MOBILIARIO']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulMob" && (Permisos['MOBILIARIO'].includes('4') || Permisos['MOBILIARIO'].includes('2') || Permisos['MOBILIARIO'].includes('1') || Permisos['MOBILIARIO'].includes('3'))) {

        connectWebSocket();

        function showErrorAlert(message) {
            Swal.fire({
                icon: "error",
                title: 'Hubo un error :(',
                text: message,
            });
        }

        function sendWebSocketMessage(data) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            } else {
                console.error('WebSocket no está abierto, no se puede enviar el mensaje:', data);
                ws.addEventListener('open', function onOpen() {
                    ws.send(JSON.stringify(data));
                    ws.removeEventListener('open', onOpen);
                });
            }
        }

        function showSuccessAlert(message) {
            Swal.fire({
                icon: "success",
                title: "Operación exitosa",
                text: message,
            }).then(() => {
                location.href = '/users/consulMob'
            })
        }

        function handleSocketResponse(event) {
            const data = JSON.parse(event.data)
            switch (data.type) {
                case 'Error_Mobiliario_Respuesta':
                    showErrorAlert(data.message)
                    break
                case 'Mobiliario_Respuesta':
                    console.log('sadasd')
                    showSuccessAlert(data.message)
                    break
                case 'ErrorModMob':
                    showErrorAlert(data.message)
                    break
                case 'RespDelMob':
                    showSuccessAlert(data.message)
                    break
                case 'Desp_Mobiliario':
                    const tbody = document.querySelector(".data-mob tbody");

                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${data.Articulo}</td>
                        <td>${data.Cantidad}</td>
                    `;

                    tr.addEventListener('click', () => {
                        if ($('.fa-pencil-square-o').css('visibility', 'hidden')) {
                            $('.fa-pencil-square-o').css('visibility', 'visible');
                            const inputM = $('.EditDataM');
                            inputM.attr("readonly", true);
                            $('.modyMob').remove();
                            $('.cancelMob').remove();
                        }
                        if ($('.editM').css('display', 'none')){
                            $('.editM').css('display', 'block')
                        } 
                        if ($('.fa-circle-plus').css('display', 'none')){
                            $('.fa-circle-plus').css('display', 'block')
                        } 
                        $('.Fname').val(data.Articulo);
                        $('.UbiM').val(data.Ubicacion);
                        $('.CantidadM').val(data.Cantidad);
                        $('.DescM').val(data.Descripcion);
                        const getImage = {
                            type: "Obtener_Imagen",
                            articulo: data.Articulo,
                            descripcion: data.Descripcion,
                            empleado: user
                        }
                        sendWebSocketMessage(getImage)
                    });
                    tbody.appendChild(tr);
                    break
                case 'Imagen_Obtenida':
                    const imgElement = document.querySelector('.furniture-image');
                    imgElement.src = `data:image/jpeg;base64,${data.imagenBase64}`;
                    break
                case 'Actualizar_Tabla':
                    $('.data-mob tbody').append(`<tr><td>${data.Articulo}</td><td>${data.Cantidad}</td></tr>`)
                    break
                default:
                    console.log('Mensaje no manejado:', data);
                    break;
            }
        }

        ws.onmessage = handleSocketResponse;

        function addFurniture() {
            const updatedData = {
                Articulo: document.querySelector('.Fname').value,
                Cantidad: document.querySelector('.CantidadM').value,
                Ubicacion: document.querySelector('.UbiM').value,
                Descripcion: document.querySelector('.DescM').value,
                User: user
            };

            const data = {
                type: 'Altas_Mobiliario',
                data: updatedData,
            };

            sendWebSocketMessage(data)
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

                var add = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="addFurniture()" class="modyMob">`;
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

        function addImage(inputFile, articulo, descripcion) {
            const file = inputFile.files[0];

            if (!file) {
                console.error('No se ha seleccionado ningún archivo.');
                return;
            }
            // 789456130951753
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                const imageBase64 = reader.result;

                const message = {
                    type: 'Guardar_Imagen',
                    imagenBase64: imageBase64,
                    articulo: articulo,
                    descripcion: descripcion,
                    empleado: user,
                    // nombreArchivo: file.name // Enviar el nombre del archivo
                };
                sendWebSocketMessage(message)
            };
        }

        function modify(oldName) {
            const updatedData = {
                Articulo: document.querySelector('.Fname').value,
                Cantidad: document.querySelector('.CantidadM').value,
                Ubicacion: document.querySelector('.UbiM').value,
                Descripcion: document.querySelector('.DescM').value,
                dataOld: oldName
            };

            const data = {
                type: 'Cambios_Mobiliario',
                data: updatedData,
            };
            sendWebSocketMessage(data)
        }
        // FUNCIONALIDAD PÁGINA
        const edit = $('.editM');

        edit.click(function (e) {
            var nombre_Articulo = $('.Fname').val();
            const inputM = $('.EditDataM');
            const image = $('.furniture-image')

            image.css('cursor', 'pointer')
            inputM.attr("readonly", false);
            var modify = `<input type="submit" value="Guardar" id="modyMob" name="modyMob" onclick="modify('${nombre_Articulo}')" class="modyMob">`;
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

        // FUNCIONOALIDAD WEBSOCKETS
        ws.onopen = function () {
            const data = {
                type: 'Consul_Mobiliario',
                user: localStorage.getItem('user')
            };
            sendWebSocketMessage(data)
        };

    }
}
