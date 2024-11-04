window.insertSelectForEmployees = function (defaultEmployee) {
    // Verificamos si el permiso es '5'
    if (Permisos['MOBILIARIO'].includes('5')) {
        const targetDiv = document.querySelector('.DF');
        if (!document.querySelector('#actionSelect') && !document.querySelector('label[for="actionSelect"]')) {
            const selectHTML = `
            <div class="DF">
                <label for="actionSelect">Encargado:</label>
                <select id="actionSelect" name="actionSelect" class="actionSelect"">
                    <option value="">Cargando encargados...</option> 
                </select>
            </div>`;
            targetDiv.insertAdjacentHTML('beforebegin', selectHTML);
            const employSelect = document.querySelector('#actionSelect');

            fetch('/responsiva/getEmploys', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                employSelect.innerHTML = '<option value="">Encargado</option>';
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.employee;
                    option.textContent = item.employee;
                    employSelect.appendChild(option);
                });

                // Establecer el valor predeterminado si se proporciona
                if (defaultEmployee) {
                    employSelect.value = defaultEmployee;
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
            });

            employSelect.addEventListener('change', function (e) {
                const selectedOption = e.target.value;
                console.log('Empleado seleccionado:', selectedOption);
            });
        }
    }
};
