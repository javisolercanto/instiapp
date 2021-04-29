const express = require('express');
const { AuthJwt } = require("../middleware");
const PostController = require("../controllers/post.controller");
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

    app.get('/api/posts/',
        PostController.findAll
    );
    app.get('/api/posts/find/:post',
    PostController.findByName
    );
    app.get('/api/post/:post',
    PostController.get
    );
    app.get('/api/post/:post/replies',
        PostController.getReplies
    );
    app.post('/api/post/',
        [AuthJwt.verifyToken],
        PostController.create
    );
    app.put('/api/post/:post',
        [AuthJwt.verifyToken],
        PostController.update
    );
    app.put('/api/post/react/:post',
        [AuthJwt.verifyToken],
        PostController.toogleReaction
    );
    app.delete('/api/post/:post',
        [AuthJwt.verifyToken],
        PostController.delete
    );
};