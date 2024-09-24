var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['EQUIPOS']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulEqp" && (Permisos['EQUIPOS'].includes('4') || Permisos['EQUIPOS'].includes('2') || Permisos['EQUIPOS'].includes('1') || Permisos['EQUIPOS'].includes('3'))) {

        const Asignacion = $('.AsignCPU')
        const Hardware = $('.Hardware')
        const Software = $('.Software')
        const Mouse = $('.Mouse')
        const Teclado = $('.Teclado')
        const Accesorio = $('.Accesorio')
        const Components = $('.Components')
        const Components_CPU = $('.Components_CPU')
        const div_Asignacion = $('.Asignation')

        function addEquipment(e) {

            e.preventDefault()

            const addData = {

                Num_Serie: document.querySelector('.NumSerieE').value,
                Equipo: document.querySelector('.Ename').value,
                Marca: document.querySelector('.MarcaE').value,
                Modelo: document.querySelector('.ModeloE').value,
                Ubi: document.querySelector('.UbiE').value,
                User: user

            };

            if (Asignacion && Asignacion.val().trim() !== '') {
                addData.Num_Serie_CPU = Asignacion.val()
            }

            if (Hardware && Hardware.val().trim() !== '') {
                addData.Hardware = Hardware.val()
            }

            if (Software && Software.val().trim() !== '') {
                addData.Software = Software.val()
            }

            if (Mouse && Mouse.val().trim() !== '') {
                addData.Mouse = Mouse.val()
            }

            if (Teclado && Teclado.val().trim() !== '') {
                addData.Teclado = Teclado.val()
            }

            if (Accesorio && Accesorio.val().trim() !== '') {
                addData.Accesorio = Accesorio.val()
            }

            if (document.querySelector('.Ename').value === 'CPU' && ((Hardware.val().trim() === '') || (Software.val().trim() === ''))) {
                console.log('CASDASIDJo')
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    text: 'Debes llenar todos los datos para continuar.',
                })

            }

            if (!checkEmptyFields(addData)) {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrió un error",
                    text: 'Debes llenar todos los datos para continuar.',
                })
            } else {
                fetch('/new_eqp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addData)
                }).then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
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

        // Botón para añadir
        document.addEventListener('DOMContentLoaded', function () {

            div_Asignacion.css('display', 'none')

            const Extras = $('.Extras')
            const Extras_CPU = $('.Extras_CPU')

            Components.css('display', 'none')
            Components_CPU.css('display', 'none')

            const selectEqp = $('.Ename')
            selectEqp.append($('<option>', { disabled: true, selected: true }))
            selectEqp.append($('<option>', { value: 'CPU', text: 'CPU' }))
            selectEqp.append($('<option>', { value: 'MONITOR', text: 'MONITOR' }))
            selectEqp.append($('<option>', { value: 'IMPRESORA', text: 'IMPRESORA' }))
            selectEqp.append($('<option>', { value: 'NOBREAK', text: 'NOBREAK' }))
            selectEqp.append($('<option>', { value: 'REGULADOR', text: 'REGULADOR' }))
            selectEqp.append($('<option>', { value: 'MULTIFUNCIONAL', text: 'MULTIFUNCIONAL' }))
            selectEqp.append($('<option>', { value: 'TELÉFONO', text: 'TELÉFONO' }))
            selectEqp.append($('<option>', { value: 'PIZARRÓN DIGITAL', text: 'PIZARRÓN DIGITAL' }))
            selectEqp.append($('<option>', { value: 'SERVIDOR', text: 'SERVIDOR' }))
            selectEqp.append($('<option>', { value: 'SWITCH', text: 'SWITCH' }))
            selectEqp.append($('<option>', { value: 'GATEWAY', text: 'GATEWAY' }))
            selectEqp.append($('<option>', { value: 'BOCINA', text: 'BOCINA' }))
            selectEqp.append($('<option>', { value: 'PROYECTOR', text: 'PROYECTOR' }))

            selectEqp.on('change', function () {
                if (selectEqp.val() !== 'MONITOR') {
                    div_Asignacion.slideUp()
                    Asignacion.attr('required', false)
                } else {
                    div_Asignacion.slideDown()
                    Asignacion.attr('required', true)
                }

                if (selectEqp.val() !== 'CPU') {
                    Components.slideUp()
                    Extras.attr('required', false);
                } else {
                    Components.slideDown()
                    Extras_CPU.attr('required', true);
                }
            })

            const addP = $('.fa-circle-plus')
            addP.click(function (e) {

                var add = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="addEquipment(event)" class="Modify">`;
                var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear()" name="cancelEqp" class="Cancel">';

                addFunctions(add, cancel, 'Ingresa los datos del equipo')
            })

        });

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

            if (Asignacion.val() !== '' || Asignacion.val() !== null || Asignacion.val() || undefined) {
                updatedData.Num_Serie_CPU = Asignacion.val()
            }

            fetch('/mod_eqp', {
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

        // Borrar equipo
        const trash = $('.trash')
        trash.click(function (e) {
            var NumSerie = $('.NumSerieE').val()

            if (NumSerie !== '') {

                const formData = new FormData()
                formData.append('Num_Serie', NumSerie)
                formData.append('user', user)

                fetch('/del_eqp', {
                    method: 'POST',
                    body: formData
                }).then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
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
        })

        // FUNCIONALIDAD PÁGINA
        const edit = $('.edit');

        edit.click(function (e) {

            var Num_Serie = $('.NumSerieE').val();

            var modify = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="modify('${Num_Serie}', event)" class="Modify">`;
            var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear()" name="cancelEqp" class="Cancel">';

            editsFunctions(modify, cancel)
        });

        fetch('/Equipos', {
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
                console.log(data)
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

        const excel = $('.excel-icon')

        if (excel.length > 0) {
            excel.click(function (e) {
                Excels('ExcelE')
            })
        }

    }
}