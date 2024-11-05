function customId(req, update) {
    const abc1 = 'abcdefghij';
    const abc2 = 'klmnñopqrs';
    const abc3 = 'tuvwxyzABC';
    const abc4 = 'DEFGHIJKLM';
    const abc5 = 'NÑOPQRSTUV';
    const abc6 = 'WXYZ123456';
    const abc7 = '7890';
    let customId

    console.log(req.body)

    // Verifica si hay usuario o encargado
    if (req.body.user == null || req.body.user == 'null') {
        console.log('Si entra aquí')
        req.body.user = req.body.encargado;
    }
    //console.log(req.body)

    console.log("El usuario anterior es " + req.body.oldUsuario);

    // Valida si hay un usuario anterior
    if (req.body.oldUsuario == null || req.body.oldUsuario == 'null') {
        // Crea el ID con el articulo y descripcion nueva
        if (req.body.Narticulo && req.body.Ndescripcion && update) {
            customId = `${req.body.Narticulo}A${req.body.Ndescripcion}A${req.body.user}`;
        } else {
            customId = `${req.body.articulo}A${req.body.descripcion}A${req.body.user}`;
        }
    } else {
        // Crea el ID con el articulo y descripcion nueva
        if (req.body.Narticulo && req.body.Ndescripcion && req.body.oldUsuario && update) {
            customId = `${req.body.Narticulo}A${req.body.Ndescripcion}A${req.body.user}`;
        } else {
            customId = `${req.body.articulo}A${req.body.descripcion}A${req.body.oldUsuario}`;
        }
    }



    console.log(customId)
    let count = 0;

    const getHexEquivalent = (char) => {
        if (abc1.includes(char)) return abc1.indexOf(char).toString();
        if (abc2.includes(char)) return abc2.indexOf(char).toString();
        if (abc3.includes(char)) return abc3.indexOf(char).toString();
        if (abc4.includes(char)) return abc4.indexOf(char).toString();
        if (abc5.includes(char)) return abc5.indexOf(char).toString();
        if (abc6.includes(char)) return abc6.indexOf(char).toString();
        if (abc7.includes(char)) return abc7.indexOf(char).toString();
        return '1';
    };

    // Replace invalid characters and add indices
    let newId = '';
    for (let i = 0; i < customId.length; i++) {
        const char = customId[i];
        if (/[0-9a-fA-F]/.test(char)) {
            newId += char;
        } else {
            newId += getHexEquivalent(char);
        }
    }

    // Extend to 24 characters if necessary
    while (newId.length < 24) {
        const char = newId[count];
        if (abc1.indexOf(char) !== -1) {
            newId = newId.concat(abc1.indexOf(char));
        } else if (abc2.indexOf(char) !== -1) {
            newId = newId.concat(abc2.indexOf(char));
        } else if (abc3.indexOf(char) !== -1) {
            newId = newId.concat(abc3.indexOf(char));
        } else if (abc4.indexOf(char) !== -1) {
            newId = newId.concat(abc4.indexOf(char));
        } else if (abc5.indexOf(char) !== -1) {
            newId = newId.concat(abc5.indexOf(char));
        } else if (abc6.indexOf(char) !== -1) {
            newId = newId.concat(abc6.indexOf(char));
        } else if (abc7.indexOf(char) !== -1) {
            newId = newId.concat(abc7.indexOf(char));
        } else {
            newId = newId.concat(1);
        }
        count = count + 1;
    }

    // Ensure all characters are uppercase
    customId = newId.toUpperCase();

    console.log(customId);
    return customId
}

module.exports = customId;