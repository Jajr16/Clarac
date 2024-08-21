// Función para cargar los datos del archivo JSON y llenar el select
async function cargarEquipos() {
    try {
        const response = await fetch('/javascripts/equipos_list.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const equiposJson = await response.json();
        
        const selectEname = document.getElementById('Ename');
        
        equiposJson.forEach(item => {
            const option = document.createElement('option');
            option.value = item.EQUIPO;
            option.textContent = item.EQUIPO;
            selectEname.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar información de equipos equipos. ', error);
    }
}

// Llamar a la función para cargar los equipos al cargar la página
document.addEventListener('DOMContentLoaded', cargarEquipos);
