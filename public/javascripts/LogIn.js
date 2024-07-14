const form = document.getElementById('Formulario')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const username = $('#user').val()
    const pass = $('#pass').val()

    fetch('/csrf-token')
        .then(response => response.json())
        .then(data => {
            // Luego de obtener el token CSRF, procedes con la solicitud POST
            const username = $('#user').val();
            const pass = $('#pass').val();

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': data.csrfToken  // Incluir el token CSRF en los headers de la solicitud
                },
                body: JSON.stringify({ username, pass })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.type === 'success') {
                        // Usuario autenticado correctamente
                        localStorage.setItem('user', data.Usuario);
                        localStorage.setItem('permisosModulos', JSON.stringify(data.permisosModulos));
                        localStorage.setItem('area', data.area);
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
                    document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
                });
        })
        .catch(error => {
            console.error('Error al obtener token CSRF:', error);
            // Manejar el error al obtener el token CSRF
        });

})