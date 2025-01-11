var Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['ALMACÉN']) {
    location.href = "index";
} else {
    if (pathname == "/users/registro_PS" && (Permisos['ALMACÉN'].includes('4') && Permisos['ALMACÉN'].includes('2') && Permisos['ALMACÉN'].includes('1') && Permisos['ALMACÉN'].includes('3'))) {

        // Consulta de productos sacados
        fetch('/prods_sacados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                const tbody = document.querySelector(".data-prod tbody");
                console.log(data)
                data.forEach(item => {
                    let tr = document.createElement('tr');

                    tr.innerHTML = `
                        <td>${item.Cod_BarrasS}</td>
                        <td>${item.Articulo}</td>
                        <td>${item.Nombre_Empleado}</td>
                        <td>${item.Cantidad_Salida}</td>
                        <td>${item.FSalida}</td>
                    `;

                    tbody.appendChild(tr);
                });
                empty_table('data-prod', 5);
                sselect();
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
            });


        window.addEventListener("load", function (event) {
            const excel = $('.excel-icon');
        
            if (excel.length > 0) {
                excel.click(function (e) {
                    Excels('ExcelRPS');
                });
            }
        })

    }
}