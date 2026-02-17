// Login Controller
const service = require('./login.service');

exports.login = async (req, res) => {
    try {
        const result = await service.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(error)
    }
}