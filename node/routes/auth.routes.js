const express = require('express');
const { VerifyRegister } = require("../middleware");
const { AuthJwt } = require("../middleware");
const AuthController = require('../controllers/auth.controller');
const cors = require('cors');

module.exports = (app) => {

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    app.post('/api/auth/register',
        [VerifyRegister.checkDuplicateUsernameOrEmail],
        AuthController.register
    );

    app.post('/api/auth/login', AuthController.login);
    app.get('/api/auth/login',
        [AuthJwt.verifyToken],
        AuthController.autoLogin
    );
};