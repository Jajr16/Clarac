// Función para cargar los datos del archivo JSON y llenar los selects
async function cargarProductos() {
    try {
        const response = await fetch('/javascripts/productos_list.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Desplegar categorias y unidades
        const data = await response.json();

        // Desplegar categorias
        const selectCateP = document.getElementById('CateP');
        data.categorias.forEach(item => {
            const option = document.createElement('option');
            option.value = item.CATEGORIA;
            option.textContent = item.CATEGORIA;
            selectCateP.appendChild(option);
        });

        // Desplegar unidades
        const selectUnidadP = document.getElementById('UnidadP');
        data.unidades.forEach(item => {
            const option = document.createElement('option');
            option.value = item.UNIDAD;
            option.textContent = item.UNIDAD;
            selectUnidadP.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar información de los productos. ', error);
    }
}

// Llamar a la función para cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
