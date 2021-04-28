const express = require('express');
const { AuthJwt } = require("../middleware");
const RouteController = require("../controllers/route.controller");
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

    app.get('/api/route/find',
        RouteController.findAll
    );
    app.get('/api/route/find/:route',
        RouteController.findByName
    );
    app.get('/api/route/:route',
        RouteController.get
    );
    app.post('/api/route/',
        [AuthJwt.verifyToken],
        RouteController.create
    );
    app.put('/api/route/:route',
        [AuthJwt.verifyToken],
        RouteController.update
    );
    app.delete('/api/route/:route',
        [AuthJwt.verifyToken],
        RouteController.delete
    );
};