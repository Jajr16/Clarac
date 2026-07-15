// Login Controller
const service = require('./login.service');

exports.login = async (req, res, next) => {
    try {
        const result = await service.login(req.body);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: false, 
            maxAge: 15 * 60 * 1000
        });


        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}