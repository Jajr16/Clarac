window.insertSelectForEmployees = function (defaultEmployee) {
    if (Permisos['MOBILIARIO'].includes('5')) {
        const targetDiv = document.querySelector('.DF');
        if (!document.querySelector('#actionSelect') && !document.querySelector('label[for="actionSelect"]')) {
            const selectHTML = `
                <div class="DF">
                    <label for="actionSelect">Encargado:</label>
                    <select id="actionSelect" name="actionSelect" class="actionSelect">
                        <option value="">Cargando encargados...</option> 
                    </select>
                </div>`;
            targetDiv.insertAdjacentHTML('beforebegin', selectHTML);

            const selectInstance = new SlimSelect({
                select: '#actionSelect'
            });

            // Estilo (puedes conservar tu parte de jQuery si usas jQuery, pero mejor con CSS)
            $('.actionSelect').css('margin-bottom', '0');
            $('.ss-main').css({
                'margin-bottom': '0',
                'background-color': 'var(--light_gray)',
                'border-radius': '0.7rem',
                'color': 'black'
            });

            // Cargar datos después
            fetch('/responsiva/getUsersAndEmploys', {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                const options = [{
                    text: 'Encargado...',
                    value: '',
                    disabled: true,
                    selected: true
                }];

                data.forEach(item => {
                    options.push({
                        text: item.employee,
                        value: item.user,
                        encargado: item.employee
                    });
                });

                // Cargar opciones en SlimSelect
                selectInstance.setData(options);

                if (defaultEmployee) {
                    const found = options.find(opt => opt.text.trim() === defaultEmployee.trim());
                    if (found) {
                        selectInstance.setSelected(selectedValue = found.value);
                    }
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                showErrorAlert('Error en el servidor. Por favor, inténtelo de nuevo más tarde.');
            });
        }
    }
};
