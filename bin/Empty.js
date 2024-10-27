function noProcess(resultado) {
    for (const fila of resultado) {
        if (Array.isArray(fila)) {
            for (const obj of fila) {
                if (obj.status === 'Empty') {
                    return obj.status;  // Devuelve el status si lo encuentra
                }
            }
        }
    }
    return 'No success';  // Retorna esto si no encuentra 'Success'
}

module.exports = noProcess