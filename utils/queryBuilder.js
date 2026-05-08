function buildQuery(table, data, where) {
    const setFields = [];
    const values = [];

    for (const key in data) {
        if (data[key] !== undefined) {
            setFields.push(`${key} = ?`);
            values.push(data[key]);
        }
    }

    if (!setFields.length) {
        throw new Error('No se proporcionaron campos para actualizar');
    }

    const whereFields = [];
    for (const key in where) {
        whereFields.push(`${key} = ?`);
        values.push(where[key]);
    }

    return {
        query: `UPDATE ${table} SET ${setFields.join(', ')} WHERE ${whereFields.join(' AND ')}`,
        values
    }
}