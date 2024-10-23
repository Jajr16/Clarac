document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-logout').addEventListener('click', function (e) {
        e.preventDefault();
    
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Error al cerrar sesión. Por favor, inténtelo de nuevo.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
})

function showErrorAlert(message) {
    Swal.fire({
        icon: "error",
        title: 'Hubo un error :(',
        text: message,
    });
}

function showErrorAlertReload(message, render) {
    Swal.fire({
        icon: "error",
        title: 'Hubo un error :(',
        text: message,
    }).then(() => {
        window.location.href = render;
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

function empty_table(tabla, n) {
    $('#' + tabla + ' tbody').append($('<tr><td colspan="' + n + '"><center><h3>En este momento no hay nada agregado.</h3></center></td></tr>'))
}

function iconsLogic() {
    if ($('.fa-pencil-square-o').css('visibility', 'hidden') && $('.fa-trash').css('visibility', 'hidden')) {
        $('.fa-pencil-square-o').css('visibility', 'visible');
        $('.fa-trash').css('visibility', 'visible');

        const inputM = $('.EditData');
        const inputS = $('.EditSelect');
        inputM.attr("readonly", true);
        inputS.attr("disabled", true);
        $('.Modify').remove();
        $('.Cancel').remove();
        console.log('CAcaca1')
    }
    if ($('.edit').css('display', 'none')) {
        console.log('Caca2')
        $('.edit').css('display', 'block')
    }
    if ($('.trash').css('display', 'none')) {
        $('.trash').css('display', 'block')
    }
    if ($('.fa-circle-plus').css('display', 'none')) {
        $('.fa-circle-plus').css('display', 'block')
    }
}

function editsFunctions(modify, cancel) {
    const inputM = $('.EditData');
    const inputS = $('.EditSelect');
    inputM.attr("readonly", false);
    inputS.attr("disabled", false);

    $('.Modify').remove();
    $('.Cancel').remove();
    $('.fa-circle-plus').css('display', 'none')
    $('.buttons').append(modify);
    $('.buttons').append(cancel);
}

function addFunctions(add, cancel, mensaje) {
    const inputM = $('.EditData');
    const inputS = $('.EditSelect');

    inputM.attr("readonly", false);
    inputS.attr("disabled", false);
    inputM.attr("placeholder", mensaje);
    inputM.val('')
    inputS.val('')

    $('.Modify').remove();
    $('.Cancel').remove();
    $('.buttons').append(add);
    $('.buttons').append(cancel);

    const edit = $('.edit');
    edit.css('display', 'none')
    const trash = $('.trash');
    trash.css('display', 'none')
}

function dissapear() {
    const inputM = $('.EditData')
    const inputS = $('.EditSelect')

    inputM.attr("placeholder", '')
    inputM.attr("readonly", true)
    inputS.attr('disabled', true)
    inputM.val('')
    inputS.val('')
    $('.Modify').remove()
    $('.Cancel').remove()
    $('.fa-circle-plus').css('display', 'block')

    const edit = $('.edit');
    edit.css('display', 'none')
    const trash = $('.trash');
    trash.css('display', 'none')
}

function empty_table() {
    $('.info-table tbody').append($('<tr><td colspan="2"><center><h3>En este momento no hay nada agregado.</h3></center></td></tr>'))
}

function sselect() {
    let searchs = $('.searchInput').toArray()
    searchs.forEach(element => {

        new SlimSelect({
            select: element
        });

    });
}

function Excels(page) {
    fetch(`/excels/${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    })
        .then(response => {
            if (response.ok) {
                const filename = response.headers.get('X-Filename') || 'Almacen.xlsx'; // Usar el nombre desde el servidor
                return response.blob().then(data => ({ data, filename })); // Retornar el Blob y el nombre
            } else {
                return response.json(); // Si hay un error, manejarlo como JSON
            }
        })
        .then(({ data, filename }) => {
            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Usar el nombre recibido o por defecto
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Liberar el objeto URL
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            document.getElementById('errorMessage').innerText = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
        });
}

function checkEmptyFields(data) {
    for (const key in data) {
        if (key === 'AsignCPU') {
            continue;
        } else if (data[key] === '' || data[key] === null || data[key] === undefined) {
            return false;
        }
    }
    return true;
}

function addBody(Text, e){
    e.preventDefault()
    $('.description-product').html(Text)
}

function colortable() {
    const tbody = document.querySelector(".data-prod tbody");

    tbody.querySelectorAll('tr').forEach(tr => {
        tr.addEventListener('click', () => {
            const codBarras = tr.querySelector('td').textContent;
            const selector = `.description-product .DP label[article='${codBarras}']`;

            if ($(selector).length === 0) {
                tr.style.backgroundColor = '';
            } else {
                tr.style.backgroundColor = '#b0c9ff';
            }
        });
    });
}

function obtenerP () {
    let productos = []

    $('.description-product .prod-count').each(
        function () {
            let producto = $(this).find('label').attr('article');
            let cantidad = $(this).find('input[type="number"]').val()

            if (producto && cantidad) {
                productos.push({
                    producto: producto,
                    cantidad: cantidad
                });
            } else {
                showErrorAlert('Debes de llenar todos los campos antes de enviar el formulario.')
            }
        }
    )
    return productos
}