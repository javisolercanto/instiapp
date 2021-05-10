const express = require('express');
const { AuthJwt } = require("../middleware");
const ProductController = require("../controllers/product.controller");
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

    app.get('/api/product/list',
        ProductController.findAll
    );
    app.get('/api/product/:product',
        ProductController.get
    );
    app.post('/api/product',
        [AuthJwt.verifyToken],
        ProductController.create
    );
    app.put('/api/product/:product',
        [AuthJwt.verifyToken],
        ProductController.update
    );
    app.delete('/api/product/:product',
        [AuthJwt.verifyToken],
        ProductController.delete
    );
};