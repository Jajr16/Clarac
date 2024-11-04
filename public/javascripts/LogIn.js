const form = document.getElementById('Formulario')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = $('#user').val()
    const pass = $('#pass').val()

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, pass })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.type === 'success') {
                // Usuario autenticado correctamente
                localStorage.setItem('user', data.Usuario);
                localStorage.setItem('permisosModulos', JSON.stringify(data.permisosModulos));
                localStorage.setItem('area', data.area);
                localStorage.setItem('nombre', data.empleado);
                console.log(data.permisosModulos);
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
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            Swal.fire({
                icon: "error",
                title: 'Hubo un error :(',
                text: 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.'
            })
        });
})