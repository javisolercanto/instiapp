const express = require('express');
const { AuthJwt } = require("../middleware");
const CodeController = require("../controllers/code.controller");
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

    app.get('/api/code/:code',
        CodeController.get
    );
    app.put('/api/code/asign/:code',
        [AuthJwt.verifyToken],
        CodeController.asignCode
    );
    app.put('/api/code/:code',
        CodeController.update
    );
    app.delete('/api/code/:code',
        CodeController.delete
    );
};