// /javascripts/Responsivas.js

// 1. CAPTURA DE VARIABLES GLOBALES
const Permisos = JSON.parse(localStorage.getItem('permisosModulos'));
const pathname = window.location.pathname;
const user = localStorage.getItem('user');

// Aduana visual de seguridad
if (!Permisos || !Permisos['RESPONSIVAS']) {
    window.location.href = "index";
} else if (pathname === "/users/responsivas" && Permisos['RESPONSIVAS'].includes('1')) {

    // 2. DECLARACIÓN DE INSTANCIAS GLOBALES DE SLIMSELECT
    let ssTipoResp = null;
    let ssEmpleados = null;
    let ssUbicaciones = null;

    // Ejecutamos todo cuando el DOM esté completamente listo
    document.addEventListener('DOMContentLoaded', async () => {
        // A) Inicializamos los tres SlimSelect apuntando a sus IDs únicos estrictos
        ssTipoResp = new SlimSelect({ select: '#selectTipoResp' });
        ssEmpleados = new SlimSelect({ select: '#selectEmpleado' });

        // Inicialización condicionada de Ubicaciones según tus permisos actuales
        if (Permisos['ADMIN']) {
            ssUbicaciones = new SlimSelect({
                select: '#ubiSelect',
                events: {
                    addable: (value) => ({ text: value.toUpperCase(), value: value.toUpperCase() })
                }
            });
        } else {
            ssUbicaciones = new SlimSelect({ select: '#ubiSelect' });
        }

        // B) Cargamos los datos de los tres selectores de forma asíncrona paralela
        inicializarOpcionesEstaticas();
        await cargarEmpleados();
        await cargarUbicaciones();
    });

    // ==========================================================================
    // 📦 FUNCIONES DE CARGA DE DATOS (MÉTODOS LIMPIOS)
    // ==========================================================================

    function inicializarOpcionesEstaticas() {
        // Usamos .setData() que es el método correcto de SlimSelect en lugar de .append()
        ssTipoResp.setData([
            { text: 'Tipo responsiva', value: '', disabled: true, selected: true },
            { text: 'MOBILIARIO', value: 'MOBILIARIO' },
            { text: 'EQUIPOS', value: 'EQUIPOS' }
        ]);
    }

    async function cargarEmpleados() {
        try {
            const response = await fetch('/responsiva/getEmploys');
            const data = await response.json();

            const opcionesEmpleados = [{ text: 'Buscar empleados', value: '', disabled: true, selected: true }];
            data.forEach(item => {
                opcionesEmpleados.push({ text: item.employee, value: item.employee });
            });

            ssEmpleados.setData(opcionesEmpleados);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            showErrorAlert('Error al cargar la lista de empleados.');
        }
    }

    async function cargarUbicaciones() {
        try {
            const response = await fetch('/javascripts/ubicaciones.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const ubicacionRespuesta = await response.json();

            const opcionesUbicaciones = [{ text: 'Buscar por ubicación', value: '', disabled: true, selected: true }];
            ubicacionRespuesta.forEach(element => {
                opcionesUbicaciones.push({ text: element.UBICACION, value: element.UBICACION });
            });

            // Inyectamos los datos en la instancia de ubicaciones de forma segura
            ssUbicaciones.setData(opcionesUbicaciones);
        } catch (error) {
            console.error('Error al cargar información de las ubicaciones:', error);
        }
    }

    // ==========================================================================
    // ⚡ PROCESAMIENTO DEL FORMULARIO Y GENERACIÓN DE PDF
    // ==========================================================================

    // Captura del formulario usando Vanilla JS limpio
    const FormResp = document.querySelector("#crearRespon");
    const pdfContainer = document.getElementById('pdfContainer');
    const pdfViewer = document.getElementById('pdfViewer');

    FormResp.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Extraemos de forma obligatoria la posición [0] de cada uno.
        const tipoRespArr = ssTipoResp.getSelected();
        const tipoRespValor = Array.isArray(tipoRespArr) ? tipoRespArr[0] : tipoRespArr;

        const empleadoArr = ssEmpleados.getSelected();
        const empleadoValor = Array.isArray(empleadoArr) ? empleadoArr[0] : empleadoArr;

        const ubicacionArr = ssUbicaciones ? ssUbicaciones.getSelected() : null;
        let ubicacionValor = Array.isArray(ubicacionArr) ? ubicacionArr[0] : ubicacionArr;

        // Filtramos si el usuario dejó la opción por defecto o vacía
        if (!tipoRespValor || tipoRespValor === "Tipo responsiva" ||
            !empleadoValor || empleadoValor === "Buscar empleados") {
            return showErrorAlert('Por favor, selecciona un Tipo de Responsiva y un Empleado válidos.');
        }
        console.log(`Tipo Responsiva: ${tipoRespValor}, Empleado: ${empleadoValor}, Ubicación: ${ubicacionValor}`);
        // El flujo continúa de forma segura...
        const formData = new FormData();
        formData.append('Responsiva', tipoRespValor);
        formData.append('NombreEmp', empleadoValor);

        const ubiFinal = (ubicacionValor === 'Buscar por ubicación' || ubicacionValor === null || ubicacionValor === undefined) ? '' : ubicacionValor;
        formData.append('Ubicacion', ubiFinal);
        console.log(formData)

        try {
            const response = await fetch('/responsiva', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                showErrorAlert(data.message);
                throw new Error(data.message);
            }

            const blob = await response.blob();

            Swal.fire("Responsiva generada correctamente").then(() => {
                const pdfUrl = URL.createObjectURL(blob);
                pdfViewer.src = pdfUrl;
                pdfContainer.style.display = 'flex';
            });

        } catch (error) {
            console.error('Error en la solicitud de generación:', error);
            showErrorAlert('Error en el servidor al procesar el documento.');
        }
    });
}
