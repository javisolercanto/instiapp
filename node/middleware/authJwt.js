const Jwt = require('jsonwebtoken');
const Config = require('../config/auth.config.js');
const Models = require('../models');
const User = Models.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            error: 'No token provided'
        });
    }

    Jwt.verify(token, Config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                error: 'Unauthorized'
            });
        }
        req.currentUser = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.currentUser).then(user => {
        if (user.admin) {
            next();
            return;
        }

        res.status(403).send({
            error: 'Require admin role'
        });
        return;
    });
};

const AuthJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};

module.exports = AuthJwt;