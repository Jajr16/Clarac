var express = require('express');
var router = express.Router();
const jwt = require('../../middleware/verifyJWT.js');


router.get('/home', jwt, function (req, res, next) {
    res.json(req.user);
});

module.exports = router;