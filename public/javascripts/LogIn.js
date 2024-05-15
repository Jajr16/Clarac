const ws = new WebSocket('ws://localhost:3000');

const form = document.getElementById('Formulario')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = $('#Nombre').val()
    const pass = $('#Contrasena').val()
    
    const data = {
        type: 'Log',
        username: username,
        password: pass
    };
    ws.send(JSON.stringify(data));
})

ws.onmessage = (event) => {
    console.log(event)
    const data = JSON.parse(event.data);
    if (data.return == 'success') {
        // Usuario autenticado correctamente, guardar el nombre de usuario y los permisos en localStorage
        localStorage.setItem('user', data.Usuario);
        localStorage.setItem('permisosModulos', JSON.stringify(data.permisosModulos)); // Guardar el objeto completo
        localStorage.setItem('area', data.area)
        console.log(data.permisosModulos);
        // Redirigir a la página de inicio de sesión exitosa
        location.href = "/users/index";
    } else {
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            text: data.message,
        }).then(() => {
            location.href = "/";
        });
    }
}