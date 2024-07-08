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
    const data = JSON.parse(event.data);
    if (data.type == 'success') {
        // Usuario autenticado correctamente, guardar el nombre de usuario y los permisos en localStorage
        localStorage.setItem('user', data.Usuario);
        localStorage.setItem('permisosModulos', JSON.stringify(data.permisosModulos)); // Guardar el objeto completo
        localStorage.setItem('area', data.area)
        console.log(data.permisosModulos);
        ws.close()
        // Redirigir a la página de inicio de sesión exitosa
        location.href = "/users/home";
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

ws.onerror = (error) => {
    console.error('WebSocket Error: ', error);
};

ws.onclose = (event) => {
    console.log('WebSocket is closed now.', event);
};