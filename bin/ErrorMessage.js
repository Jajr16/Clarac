function extractErrorMessage(result) {
    // Recorre cada fila en el resultado para encontrar un mensaje de error
    for (const row of result) {
        if (Array.isArray(row) && row.length > 0 && row[0].Error) {
            return row[0].Error; // Devuelve el mensaje de error si lo encuentra
        }
    }
    return null; // Devuelve null si no se encuentra ningún mensaje de error
}

module.exports = extractErrorMessage;
