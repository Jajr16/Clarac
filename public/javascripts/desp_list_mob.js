// Función para cargar los datos del archivo JSON y llenar el select
async function cargarMobilairio() {
    try {
        const response = await fetch('/javascripts/mobiliario_list.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const mobiliarioJson = await response.json();

        if (Permisos['ADMIN']) {
            window.selectMobiliario = new SlimSelect({
                select: '#Fname',
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
            window.selectMobiliario = new SlimSelect({
                select: '#Fname'
            })
        }

        let options = [{
            text: '',
            value: '',
            disabled: true,
            selected: true
        }]

        mobiliarioJson.forEach(item => {
            options.push({
                text: item.ARTICULO,
                value: item.ARTICULO
            })
        });

        selectMobiliario.setData(options)

    } catch (error) {
        console.error('Error al cargar información de mobiliarios. ', error);
    }
}

// Llamar a la función para cargar los equipos al cargar la página
document.addEventListener('DOMContentLoaded', cargarMobilairio);
