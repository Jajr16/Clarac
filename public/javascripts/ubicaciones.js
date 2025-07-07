async function cargarUbicaciones() {
    try {
        const response = await fetch('/javascripts/ubicaciones.json')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const ubicacionRespuesta = await response.json();

        if (Permisos['ADMIN']) {
            window.selectUbicacion = new SlimSelect({
                select: '.ubiSelect',
                events: {
                    addable: function (value) {
                        return {
                            text: value.toUpperCase(),
                            value: value.toUpperCase()
                        }
                    }
                }
            })
        } else {
            console.log('NO PERMISO GENERAL')
            window.selectUbicacion = new SlimSelect({
                select: '.ubiSelect'
            })
        }

        let options = [{
            text: '',
            value: '',
            disabled: true,
            selected: true
        }]

        ubicacionRespuesta.forEach(element => {
            options.push({ text: element.UBICACION, value: element.UBICACION })
        });

        selectUbicacion.setData(options)


    } catch (error) {
        console.error('Error al cargar información de las ubicaciones. ', error);
    }
}

// Llamar a la función para cargar los equipos al cargar la página
document.addEventListener('DOMContentLoaded', cargarUbicaciones);