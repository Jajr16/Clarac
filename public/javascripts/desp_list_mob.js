// Función para cargar los datos del archivo JSON y llenar el select
async function cargarMobilairio() {
    try {
        const response = await fetch('/javascripts/mobiliario_list.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const mobiliarioJson = await response.json();

        const selectFname = document.getElementById('Fname');

        mobiliarioJson.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ARTICULO;
            option.textContent = item.ARTICULO;
            selectFname.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar información de mobiliarios. ', error);
    }
}

// Llamar a la función para cargar los equipos al cargar la página
document.addEventListener('DOMContentLoaded', cargarMobilairio);
