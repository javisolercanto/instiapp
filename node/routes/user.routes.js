const express = require('express');
const { AuthJwt } = require("../middleware");
const UserController = require("../controllers/user.controller");
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

    // Testing routes
    // app.get('/api/test/user',
    //     [AuthJwt.verifyToken],
    //     UserController.userBoard
    // );
    // app.get('/api/test/admin',
    //     [AuthJwt.verifyToken, AuthJwt.isAdmin],
    //     UserController.adminBoard
    // );

    // Action routes
    app.get('/api/users',
        [AuthJwt.verifyToken, AuthJwt.isAdmin],
        UserController.findAll
    );
    app.get('/api/user/profile',
        [AuthJwt.verifyToken],
        UserController.profile
    );
    app.get('/api/user/posts',
        [AuthJwt.verifyToken],
        UserController.getPosts
    );
    app.get('/api/user/products',
        [AuthJwt.verifyToken],
        UserController.getProducts
    );
    app.get('/api/user/rentals',
        [AuthJwt.verifyToken],
        UserController.getRentals
    );
    app.get('/api/user/routes',
        [AuthJwt.verifyToken],
        UserController.getRoutes
    );
    app.put('/api/user/',
        [AuthJwt.verifyToken],
        UserController.update
    );
    app.delete('/api/user/',
        [AuthJwt.verifyToken],
        UserController.delete
    );
};