// warehouseMain.js
import { hasPermission, getAuth } from '../../utils/permissions.js';
import { warehouseAPI } from './warehouseAPI.js';
import { warehouseUI } from './warehouseUI.js';
import { warehouseState } from './warehouseState.js';

const MODULE = 'ALMACEN';

const auth = getAuth();
console.log(auth)
const can = (action) => hasPermission(auth.permissions, MODULE, action);

async function loadProducts() {
    try {
        const data = await warehouseAPI.getProducts(auth.user);
        const active = data.filter((item) => item.eliminado !== 1);

        warehouseState.setProducts(active);
        warehouseUI.renderTable(active, handleRowClick);
        warehouseUI.bindSelectChange(handleSelectChange);
    } catch (err) {
        console.error('Error cargando productos:', err);
        warehouseUI.handleNetworkError();
    }
}

function handleRowClick(codBarras) {
    const item = warehouseState.getByCode(codBarras);
    if (item) warehouseUI.fillForm(item);
}

function handleSelectChange(articulo) {
    const item = warehouseState.getByArticulo(articulo);
    if (item) warehouseUI.fillForm(item);
}

async function handleAdd(e) {
    e.preventDefault();
    if (!can('create')) return;

    const formData = warehouseUI.readFormValues();
    if (!checkEmptyFields(formData)) {
        warehouseUI.showValidationError();
        return;
    }

    try {
        const result = await warehouseAPI.createProduct(formData);
        warehouseUI.handleResult(result);
    } catch (err) {
        console.error('Error creando producto:', err);
        warehouseUI.handleNetworkError();
    }
}

async function handleEdit(codBarrasOriginal, e) {
    e.preventDefault();
    if (!can('update')) return;

    const formData = {
        ...warehouseUI.readFormValues(),
        dataOldCB: codBarrasOriginal,
        User: auth.user
    };

    try {
        const result = await warehouseAPI.updateProduct(formData);
        warehouseUI.handleResult(result, 'RespDelProd');
    } catch (err) {
        console.error('Error actualizando producto:', err);
        warehouseUI.handleNetworkError();
    }
}

async function handleDelete() {
    if (!can('delete')) return;

    const codBarras = document.querySelector('.CodBarrasP').value;
    if (!codBarras) return;

    try {
        const result = await warehouseAPI.deleteProduct(codBarras);
        warehouseUI.handleResult(result);
    } catch (err) {
        console.error('Error eliminando producto:', err);
        warehouseUI.handleNetworkError();
    }
}

function bindActionButtons() {
    warehouseUI.populateSelects();

    if (can('create')) {
        $('.fa-circle-plus').on('click', () => {
            warehouseUI.showAddForm({ onSave: handleAdd, onCancel: dissapear });
        });
    }

    if (can('update')) {
        $('.edit').on('click', () => {
            const codBarras = $('.CodBarrasP').val();
            warehouseUI.showEditForm({
                onSave: (e) => handleEdit(codBarras, e),
                onCancel: dissapear
            });
        });
    }

    if (can('delete')) {
        $('.trash').on('click', handleDelete);
    }

    const excel = $('.excel-icon');
    if (excel.length > 0) {
        excel.on('click', () => Excels('ExcelA'));
    }
}

function init() {
    if (!can('read')) {
        // location.href = '/users/home';
        return;
    }

    document.addEventListener('DOMContentLoaded', bindActionButtons);
    window.addEventListener('load', loadProducts);
}

init();