// Validate DTO
module.exports = schema => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (e) {
        return res.status(422).json({
            message: 'Datos inválidos',
            errors: e.errors.map(err => ({
                campo: err.path.join('.'),
                mensaje: err.message
            }))
        });
    }
};