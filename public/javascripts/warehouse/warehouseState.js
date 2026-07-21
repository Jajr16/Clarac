const productsByCode = new Map();

export const warehouseState = {
    setProducts(products) {
        productsByCode.clear();
        products.forEach((p) => productsByCode.set(p.Cod_Barras, p));
    },

    getByCode(codBarras) {
        return productsByCode.get(codBarras);
    },

    getByArticulo(articulo) {
        for (const item of productsByCode.values()) {
            if (item.Articulo === articulo) return item;
        }
        return undefined;
    },

    getAll() {
        return [...productsByCode.values()];
    }
};
