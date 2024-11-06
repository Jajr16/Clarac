var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/petalm" && (Permisos['ALMACÉN'].includes('4') && Permisos['ALMACÉN'].includes('2') && Permisos['ALMACÉN'].includes('1') && Permisos['ALMACÉN'].includes('3'))) {
        function initStatus() {
            fetch('/pet/viewStatusAlmacen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector('.info-table tbody')
                    tbody.innerHTML = "";
                    data.dataToSend.forEach(item => {
                        let tr = document.createElement('tr');
                        let date = normalizeDate(item.fecha);

                        tr.innerHTML = `
                            <td>${date}</td>
                            <td>${item.Arti}</td>
                            <td>${item.Cantidad}</td>
                            <td>${item.Nombre}</td>
                            <td>${item.Estatus}</td>
                        `;
                        if (item.Estatus !== 'Artículo entregado, falta confirmación del solicitante.' &&
                            item.Estatus !== 'Entrega confirmada por ambas partes.' &&
                            item.Estatus !== 'Entrega finalizada') {
                            tr.addEventListener('click', () => {
                                Swal.fire({
                                    title: '¿Ya entregaste este producto?',
                                    text: `Confirma la operación en caso de haber entregado el producto que solicitó: ${item.Nombre}.`,
                                    icon: "warning",
                                    cancelButtonText: "Cancelar",
                                    confirmButtonText: `Si, ya entregué el artículo: ${item.Arti}`,
                                    showCancelButton: true,
                                    confirmButtonColor: "#001781",
                                    cancelButtonColor: 'rgb(134, 0, 0)'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        fetch('/pet/ConfirmAlmacen', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ fecha: date, Cod_Barras: item.Cod_Barras, Solicitante: item.Nombre })
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
                                                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                                            });
                                    }
                                })
                            });
                        }
                        tbody.appendChild(tr)
                    })
                    empty_table('status-peti', 5)
                }).catch(error => {
                    console.error('Error en la solicitud:', error);
                    document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                });
        }
        document.addEventListener('DOMContentLoaded', function () {
            initStatus()
            $('.History').click(() => {
                const icon = $('.fa-clock-rotate-left');
                if (icon.attr('data-history') === 'true') {
                    // Ver Estado Actual
                    fetch('/pet/viewHistoryAlmacenista', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            const tbody = document.querySelector('.status-peti tbody');
                            tbody.innerHTML = "";
                            data.dataToSend.forEach(item => {
                                let tr = document.createElement('tr');
                                let date = normalizeDate(item.fecha);

                                tr.innerHTML = `
                                    <td>${date}</td>
                                    <td>${item.Arti}</td>
                                    <td>${item.Cantidad}</td>
                                    <td>${item.Nombre}</td>
                                    <td>${item.Estatus}</td>
                                    `

                                tbody.appendChild(tr)
                            })
                            empty_table('status-peti', 5)
                            // Cambia a estado de "actual"
                            icon.attr('data-history', 'false');
                        })
                        .catch(error => {
                            console.error('Error en la solicitud:', error);
                            document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                        });
                } else {
                    initStatus()
                    icon.attr('data-history', 'true');
                }
            });
        })
    }
}