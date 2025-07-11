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

        let selectEmploy = new SlimSelect({
            select: '#Employees'
        })

        let listaEquipos = ''
        if (Permisos['ADMIN']) {
            listaEquipos = new SlimSelect({
                select: '#Ename',
                events: {
                    addable: function (value) {
                        return {
                            text: value.toUpperCase(),
                            value: value.toUpperCase()
                        }
                    },
                }
            })
        } else {
            listaEquipos = new SlimSelect({
                select: '#Ename'
            })
        }

        function disabledSelect() {
            listaEquipos.setSelected('')
            listaEquipos.disable();
            selectEmploy.setSelected('')
            selectEmploy.disable();
            window.selectUbicacion.disable();
            window.selectUbicacion.setSelected('')
        }

        if (Permisos['EQUIPOS'].includes('1')) {
            function addEquipment(e) {
                e.preventDefault();

                const addData = {
                    Num_Serie: document.querySelector('.NumSerieE').value,
                    Equipo: document.querySelector('.Ename').value,

                    Marca: document.querySelector('.MarcaE').value,
                    Modelo: document.querySelector('.ModeloE').value,
                    Ubi: document.querySelector('.UbiE').value,
                    Encargado: $('.Employees').val()
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
                    fetch('/equipo/new_eqp', {
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
        }

        // Botón para añadir
        document.addEventListener('DOMContentLoaded', function () {

            div_Asignacion.css('display', 'none')

            const Extras = $('.Extras')
            const Extras_CPU = $('.Extras_CPU')

            Components.css('display', 'none')
            Components_CPU.css('display', 'none')

            const selectEqp = $('.Ename')

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

            if (Permisos['EQUIPOS'].includes('1')) {
                const addP = $('.fa-circle-plus')
                addP.click(function (e) {
                    selectEmploy.setSelected('')
                    selectEmploy.enable();
                    listaEquipos.setSelected('')
                    listaEquipos.enable();
                    window.selectUbicacion.setSelected('')
                    window.selectUbicacion.enable()

                    var add = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="addEquipment(event)" class="Modify">`;
                    var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear(); disabledSelect();" name="cancelEqp" class="Cancel">';

                    addFunctions(add, cancel, 'Ingresa los datos del equipo')
                })
            }

            fetch('../responsiva/getEmploys', {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)

                    const options = [{ text: '', value: '' }]
                    const optionlist = data.map(item => ({
                        text: item.employee,
                        value: item.employee
                    }))

                    options.push(...optionlist)

                    selectEmploy.setData(options)

                    eliminarOpcionesSueltas('.ss-main.Employees')
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.')
                });
        });
        if (Permisos['EQUIPOS'].includes('3')) {
            function modify(oldNum_Serie, oldEmp, e) {
                e.preventDefault()

                const updatedData = {
                    Num_Serie: document.querySelector('.NumSerieE').value,
                    Equipo: document.querySelector('.Ename').value,
                    Marca: document.querySelector('.MarcaE').value,
                    Modelo: document.querySelector('.ModeloE').value,
                    Ubi: document.querySelector('.UbiE').value,
                    Encargado: $('.Employees').val(),
                    EncargadoOld: oldEmp,
                    dataOldNS: oldNum_Serie
                };

                if (Asignacion && Asignacion.val().trim() !== '') {
                    updatedData.Num_Serie_CPU = Asignacion.val()
                }

                if (Hardware && Hardware.val().trim() !== '') {
                    updatedData.Hardware = Hardware.val()
                }

                if (Software && Software.val().trim() !== '') {
                    updatedData.Software = Software.val()
                }

                if (Mouse && Mouse.val().trim() !== '') {
                    updatedData.Mouse = Mouse.val()
                }

                if (Teclado && Teclado.val().trim() !== '') {
                    updatedData.Teclado = Teclado.val()
                }

                if (Accesorio && Accesorio.val().trim() !== '') {
                    updatedData.Accesorio = Accesorio.val()
                }

                if (Asignacion.val() !== '' || Asignacion.val() !== null || Asignacion.val() || undefined) {
                    updatedData.Num_Serie_CPU = Asignacion.val()
                }

                fetch('/equipo/mod_eqp', {
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
        }
        if (Permisos['EQUIPOS'].includes('2')) {
            // Borrar equipo
            const trash = $('.trash')
            trash.click(function (e) {
                var NumSerie = $('.NumSerieE').val()

                if (NumSerie !== '') {

                    const formData = new FormData()
                    formData.append('Num_Serie', NumSerie)
                    formData.append('user', $('.Employees').val(),)

                    fetch('/equipo/del_eqp', {
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
        }
        if (Permisos['EQUIPOS'].includes('3')) {
            // FUNCIONALIDAD PÁGINA
            const edit = $('.edit');

            edit.click(function (e) {
                selectEmploy.enable();
                listaEquipos.enable();
                window.selectUbicacion.enable();

                var Num_Serie = $('.NumSerieE').val();
                var encargadOld = $('.Employees').val();

                var modify = `<input type="submit" value="Guardar" id="modyEqp" name="modyEqp" onclick="modify('${Num_Serie}', '${encargadOld}', event)" class="Modify">`;
                var cancel = '<input type="submit" value="Cancelar" id="cancelEqp" onclick="dissapear(); disabledSelect();" name="cancelEqp" class="Cancel">';

                editsFunctions(modify, cancel)
            });
        }

        fetch('/equipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-eqp tbody");
                const selEqp = $('.Eqp')

                data.forEach(item => {
                    selEqp.append($('<option>', { value: item.Num_Serie, text: item.Num_Serie }))
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.Equipo}</td>
                    <td>${item.Nom}</td>
                    `;

                    selEqp.change(function () {
                        if ($(this).val() === item.Num_Serie) {
                            iconsLogic()
                            $('.NumSerieE').val(item.Num_Serie);
                            $('.Ename').val(item.Equipo);
                            listaEquipos.setSelected(item.Equipo)
                            $('.MarcaE').val(item.Marca);
                            $('.ModeloE').val(item.Modelo);
                            window.selectUbicacion.setSelected(item.Ubi)
                            $('.AsignCPU').val('')
                            selectEmploy.setSelected('')
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

                            if (item.Nom) {
                                selectEmploy.setSelected(item.Nom)
                                console.log(selectEmploy.getSelected())
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

                        $('.NumSerieE').val(item.Num_Serie);
                        $('.Ename').val(item.Equipo);
                        listaEquipos.setSelected(item.Equipo)
                        $('.MarcaE').val(item.Marca);
                        $('.ModeloE').val(item.Modelo);
                        window.selectUbicacion.setSelected(item.Ubi);
                        $('.AsignCPU').val('')
                        $('.Hardware').val('')
                        selectEmploy.setSelected('')
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

                        if (item.Nom) {
                            selectEmploy.setSelected(item.Nom)
                        }

                        if (item.Teclado) {
                            $('.Teclado').val(item.Teclado)
                        }

                        if (item.Accesorio) {
                            $('.Accesorio').val(item.Accesorio)
                        }
                    });

                    tbody.appendChild(tr);
                });
                empty_table('data-eqp', 2)
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