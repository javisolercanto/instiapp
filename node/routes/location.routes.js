const express = require('express');
const { AuthJwt } = require("../middleware");
const CategoryController = require("../controllers/location.controller");
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

    app.get('/api/location/find',
        CategoryController.findAll
    );
    app.get('/api/location/find/:location',
        CategoryController.findByName
    );
    app.get('/api/location/find/:latitude/:longitude',
        CategoryController.findByCoords
    );
    app.get('/api/location/:location',
        CategoryController.get
    );
    app.post('/api/location/',
        [AuthJwt.verifyToken],
        CategoryController.create
    );
    app.put('/api/location/:location',
        [AuthJwt.verifyToken],
        CategoryController.update
    );
    app.delete('/api/location/:location',
        [AuthJwt.verifyToken, AuthJwt.isAdmin],
        CategoryController.delete
    );
};