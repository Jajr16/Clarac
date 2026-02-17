export function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    })
}

export function redirectHome() {
    window.location.href = '/users/home';
}