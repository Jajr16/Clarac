// warehouseUI.js
// Capa de presentación del módulo ALMACEN. Solo sabe pintar y leer el DOM.
// No hace fetch, no revisa permisos, no conoce warehouseState.
// Recibe datos ya listos y callbacks para eventos: no decide QUÉ pasa
// cuando el usuario da click en "Guardar", solo AVISA que dio click.

const CATEGORIES = ['PAPELERÍA', 'LIMPIEZA', 'FERRETERÍA'];
const UNITS = ['UNIDAD', 'LITROS', 'KILOS', 'METROS'];

function fillSelect(selector, values) {
    const select = $(selector);
    select.empty();
    select.append($('<option>', { disabled: true, selected: true }));
    values.forEach((value) => select.append($('<option>', { value, text: value })));
}

export const warehouseUI = {
    populateSelects() {
        fillSelect('.CateP', CATEGORIES);
        fillSelect('.UnidadP', UNITS);
    },

    // onRowClick(codBarras) y onSelectChange(articulo) los define Main.
    renderTable(products, onRowClick) {
        const tbody = document.querySelector('.data-prod tbody');
        const selProd = $('.Prod');

        tbody.innerHTML = '';
        selProd.find('option:not(:disabled)').remove();

        const fragment = document.createDocumentFragment();
        products.forEach((item) => {
            selProd.append($('<option>', { value: item.Articulo, text: item.Articulo }));

            const tr = document.createElement('tr');
            tr.dataset.codBarras = item.Cod_Barras;
            tr.innerHTML = `<td>${item.Cod_Barras}</td><td>${item.Articulo}</td>`;
            fragment.appendChild(tr);
        });
        tbody.appendChild(fragment);

        // Un solo listener delegado, sin importar cuántas filas haya.
        tbody.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (row && row.dataset.codBarras) onRowClick(row.dataset.codBarras);
        });

        empty_table('data-prod', 2);
        sselect();
    },

    bindSelectChange(onSelectChange) {
        $('.Prod').on('change', function () {
            onSelectChange(this.value);
        });
    },

    fillForm(item) {
        iconsLogic();
        document.querySelector('.CodBarrasP').value = item.Cod_Barras;
        document.querySelector('.CateP').value = item.Categoria;
        document.querySelector('.Pname').value = item.Articulo;
        document.querySelector('.MarcaP').value = item.Marca;
        document.querySelector('.DescP').value = item.Descripcion;
        document.querySelector('.UnidadP').value = item.Unidad;
    },

    readFormValues() {
        return {
            Cod_Barras: document.querySelector('.CodBarrasP').value,
            Categoria: document.querySelector('.CateP').value,
            Articulo: document.querySelector('.Pname').value,
            Marca: document.querySelector('.MarcaP').value,
            Descripcion: document.querySelector('.DescP').value,
            Unidad: document.querySelector('.UnidadP').value
        };
    },

    // { onSave, onCancel } son callbacks que Main decide.
    // Nota: NO se usan onclick inline; el botón se inserta sin handler y el
    // listener se añade después de que addFunctions() lo mete al DOM.
    showAddForm({ onSave, onCancel }) {
        $('.CateP, .UnidadP').removeAttr('disabled');
        const addBtn = '<input type="submit" value="Guardar" id="modyProd" name="modyProd" class="Modify">';
        const cancelBtn = '<input type="submit" value="Cancelar" id="Cancel" name="Cancel" class="Cancel">';

        addFunctions(addBtn, cancelBtn, 'Ingresa los datos del producto');

        document.getElementById('modyProd').addEventListener('click', onSave);
        document.getElementById('Cancel').addEventListener('click', onCancel);
    },

    showEditForm({ onSave, onCancel }) {
        const modifyBtn = '<input type="submit" value="Guardar" id="modyProd" name="modyProd" class="Modify">';
        const cancelBtn = '<input type="submit" value="Cancelar" id="Cancel" name="Cancel" class="Cancel">';

        editsFunctions(modifyBtn, cancelBtn);

        document.getElementById('modyProd').addEventListener('click', onSave);
        document.getElementById('Cancel').addEventListener('click', onCancel);
    },

    showValidationError() {
        Swal.fire({ icon: 'error', title: 'Ocurrió un error', text: 'Debes llenar todos los datos para continuar.' });
    },

    // Traduce la respuesta del backend en feedback visual. Este es el ÚNICO
    // lugar del módulo que decide "esto se ve como éxito o como error".
    handleResult(data, successType = 'success') {
        if (data.type === successType) {
            showSuccessAlertReload(data.message);
        } else {
            showErrorAlert(data.message);
        }
    },

    handleNetworkError() {
        Swal.fire({ icon: 'error', title: 'Error de Red', text: 'No se pudo comunicar con el servidor.' });
    }
};