import { api } from '../shared/apiService.js'

export const warehouseAPI = {
    getProducts() {
        return api.request('/api/warehouse', 'GET');
    },

    createProduct(productData) {
        return api.request('/api/warehouse', 'POST', productData);
    },

    updateProduct(productData) {
        return api.request('/api/warehouse', 'PATCH', productData);
    },

    deleteProduct(codBarras) {
        const formData = new FormData();
        formData.append('Cod_Barras', codBarras);
        return api.request('/api/warehouse', 'DELETE', formData);
    }
};
