function sessionMiddleware(req, res, next) {
    res.locals.user = req.session.userId || null; // Pasar el ID de usuario a la vista
    next();
}

module.exports = sessionMiddleware;