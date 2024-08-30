var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['EQUIPOS']) {
    location.href = "index";
} else {
    if (pathname == "/users/consulEqp" && (Permisos['EQUIPOS'].includes('4') || Permisos['EQUIPOS'].includes('2') || Permisos['EQUIPOS'].includes('1') || Permisos['EQUIPOS'].includes('3'))) {

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

        // Botón para añadir
        document.addEventListener('DOMContentLoaded', function () {
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
                
                data.forEach(item => {
                    selEqp.append($('<option>', { value: item.Equipo, text: item.Equipo }))

                    let tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${item.Equipo}</td>
            <td>${item.Num_Serie}</td>
        `;
                    selEqp.change(function () {
                        iconsLogic()

                        $('.NumSerieE').val(item.Num_Serie);
                        $('.Ename').val(item.Equipo);
                        $('.MarcaE').val(item.Marca);
                        $('.ModeloE').val(item.Modelo);
                        $('.UbiE').val(item.Ubi);
                    })
                    
                    tr.addEventListener('click', () => {
                        
                        $('.NumSerieE').val(item.Num_Serie);
                        $('.Ename').val(item.Equipo);
                        $('.MarcaE').val(item.Marca);
                        $('.ModeloE').val(item.Modelo);
                        $('.UbiE').val(item.Ubi);
                        
                        iconsLogic()
                    });

                    tbody.appendChild(tr);
                });
                sselect()
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });

    }
}