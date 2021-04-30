const express = require('express');
const { AuthJwt } = require("../middleware");
const CategoryController = require("../controllers/category.controller");
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

    app.get('/api/categories',
        CategoryController.findAll
    );
    app.get('/api/category/:category',
        CategoryController.get
    );
    app.post('/api/category',
        [AuthJwt.verifyToken, AuthJwt.isAdmin],
        CategoryController.create
    );
    app.put('/api/category/:category',
        [AuthJwt.verifyToken, AuthJwt.isAdmin],
        CategoryController.update
    );
    app.delete('/api/category/:category',
        [AuthJwt.verifyToken, AuthJwt.isAdmin],
        CategoryController.delete
    );
};