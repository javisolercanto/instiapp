const express = require('express');
const { AuthJwt } = require("../middleware");
const RentalController = require("../controllers/rental.controller");
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

    app.get('/api/rentals',
        RentalController.findAll
    );
    app.get('/api/rental/:rental',
        RentalController.get
    );
    app.post('/api/rental/',
        [AuthJwt.verifyToken],
        RentalController.create
    );
    app.put('/api/rental/:rental',
        [AuthJwt.verifyToken],
        RentalController.update
    );
    app.delete('/api/rental/:rental',
        [AuthJwt.verifyToken],
        RentalController.delete
    );
};