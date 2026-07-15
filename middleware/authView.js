const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : null;

    if (!token) {
        return res.redirect('/'); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/');
    }
};
