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

function empty_table(tabla, n) {
    $('#' + tabla + ' tbody').append($('<tr><td colspan="' + n + '"><center><h3>En este momento no hay nada agregado.</h3></center></td></tr>'))
}

function iconsLogic() {
    if ($('.fa-pencil-square-o').css('visibility', 'hidden') && $('.fa-trash').css('visibility', 'hidden')) {
        $('.fa-pencil-square-o').css('visibility', 'visible');
        $('.fa-trash').css('visibility', 'visible');
        const inputM = $('.EditData');
        inputM.attr("readonly", true);
        $('.Modify').remove();
        $('.Cancel').remove();
    }
    if ($('.edit').css('display', 'none')) {
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
    inputM.attr("readonly", false);
    inputM.attr("disabled", false);
    
    $('.Modify').remove();
    $('.Cancel').remove();
    $('.fa-circle-plus').css('display', 'none')
    $('.buttons').append(modify);
    $('.buttons').append(cancel);
}

function addFunctions(add, cancel, mensaje) {
    const inputM = $('.EditData');
    
    inputM.attr("readonly", false);
    inputM.attr("disabled", false);
    inputM.attr("placeholder", mensaje);
    inputM.val('')

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

    inputM.attr("placeholder", '')
    inputM.attr("readonly", true)
    inputM.attr('disabled', true)
    inputM.val('')
    $('.Modify').remove()
    $('.Cancel').remove()
    $('.fa-circle-plus').css('display', 'block')

    const edit = $('.edit');
    edit.css('display', 'none')
    const trash = $('.trash');
    trash.css('display', 'none')
}

function empty_table(tabla, n) {
    $('#' + tabla + ' tbody').append($('<tr><td colspan="' + n + '"><center><h3>En este momento no hay nada agregado.</h3></center></td></tr>'))
}

function sselect(select) {
    if ($(select).length) {
        new SlimSelect({
            select: select
        });
    }
}