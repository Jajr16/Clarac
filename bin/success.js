function encontrarStatus(resultado) {
    for (const fila of resultado) {
        if (Array.isArray(fila)) {
            for (const obj of fila) {
                if (obj.status === 'Success') {
                    return obj.status;  // Devuelve el status si lo encuentra
                }
            }
        }
    }
    return 'No success';  // Retorna esto si no encuentra 'Success'
}

module.exports = encontrarStatus