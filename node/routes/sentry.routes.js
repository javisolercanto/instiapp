const express = require('express');

module.exports = (app) => {

    app.get('/api/debug-sentry', function mainHandler(req, res) {
        throw new Error('My first Sentry error!');
    });

};