var Permisos = JSON.parse(localStorage.getItem('permisosModulos'))
var pathname = window.location.pathname;
var user = localStorage.getItem('user');

if (!Permisos['RESPONSIVAS']) {
    location.href = "index";
} else if (pathname == "/users/responsivas" && Permisos['RESPONSIVAS'].includes('1')) {
    const resp = $('.Resp')
    const employ = $('.Employees')

    function cargarNombres() {
        socket.emit('List_empleados', "Empleados");
        socket.on('ListaNombres', (data) => {
            ListaNombres(data.Nombres);
        });
    }

    function ListaNombres(Nombr) {
        if (employ) {
            employ.append($('<option>', { value: Nombr, text: Nombr }))
        }
    }

    window.addEventListener("load", function (event) {
        if (resp && employ && Permisos['RESPONSIVAS']) {
            resp.append($('<option>', { value: 'MOBILIARIO', text: 'MOBILIARIO' }))
            resp.append($('<option>', { value: 'EQUIPOS', text: 'EQUIPOS' }))
        }

        fetch('/getEmploys', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    employ.append($('<option>', { value: item.employee, text: item.employee }))
                })
            })
    })

    const FormResp = document.querySelector("#crearRespon");
    FormResp.addEventListener("submit", (e) => {
        e.preventDefault()
        const responsivas = $(".Resp")
        const employees = $(".Employees")

        if (responsivas.val() != "" && employees.val() != "") {

            const formData = new FormData();
            formData.append('Responsiva', responsivas.val())
            formData.append('NombreEmp', employees.val())

            fetch('/responsivas', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
        }
    })
}