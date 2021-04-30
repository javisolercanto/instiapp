const express = require('express');
const { AuthJwt } = require("../middleware");
const GroupController = require("../controllers/group.controller");
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

    app.get('/api/groups',
        GroupController.findAll
    );
    app.get('/api/group/:group',
        GroupController.get
    );
    app.get('/api/group/:group/notifications',
        GroupController.notifications
    );
    app.post('/api/group/:group/request',
        [AuthJwt.verifyToken],
        GroupController.sendRequest
    );
    app.put('/api/group/:group/accept/:user',
        [AuthJwt.verifyToken],
        GroupController.acceptRequest
    );
    app.delete('/api/group/:group/deny/:user',
        [AuthJwt.verifyToken],
        GroupController.denyRequest
    );
    app.delete('/api/group/:group/remove/:user',
        [AuthJwt.verifyToken],
        GroupController.removeUser
    );
    app.post('/api/group',
        [AuthJwt.verifyToken],
        GroupController.create
    );
    app.put('/api/group/:group',
        [AuthJwt.verifyToken],
        GroupController.update
    );
    app.delete('/api/group/:group',
        [AuthJwt.verifyToken],
        GroupController.delete
    );
};