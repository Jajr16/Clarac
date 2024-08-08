function showErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: 'Hubo un error :(',
        text: message,
    });
}

function showErrorAlertReload(message) {
    Swal.fire({
        icon: "error",
        title: 'Hubo un error :(',
        text: message,
    });
}

function showSuccessAlert(message) {
    Swal.fire({
        icon: "success",
        title: "Operación exitosa",
        text: message,
    })
}

function showSuccessAlertReload(message) {
    Swal.fire({
        icon: "success",
        title: "Operación exitosa",
        text: message,
    }).then(() => {
        location.reload();
    })
}

document.addEventListener('DOMContentLoaded', function() {
    const resp = $('.Resp')
    const employ = $('.Employees')
    if (resp && employ) {
        new SlimSelect({
            select: '.Resp'
        });
        new SlimSelect({
            select: '.Employees'
        });
    }
});
