const express = require('express');
const { AuthJwt } = require("../middleware");
const LocationController = require("../controllers/location.controller");
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
        LocationController.findAll
    );
    app.get('/api/location/find/:location',
        LocationController.findByName
    );
    app.get('/api/location/find/:latitude/:longitude',
        LocationController.findByCoords
    );
    app.get('/api/location/:location',
        LocationController.get
    );
    app.post('/api/location/',
        LocationController.create
    );
    app.put('/api/location/:location',
        [AuthJwt.verifyToken],
        LocationController.update
    );
    app.delete('/api/location/:location',
        [AuthJwt.verifyToken, AuthJwt.isAdmin],
        LocationController.delete
    );
};