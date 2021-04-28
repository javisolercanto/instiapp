const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const Config = require("../config/auth.config.js");
const Models = require('../models');
const User = Models.user;

module.exports = {
    login(req, res) {
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ error: "Incorrect email" });
                }

                const passwordIsValid = Bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        error: "Incorrect password"
                    });
                }

                const token = Jwt.sign({ id: user.id }, Config.secret, {
                    expiresIn: 43200 // 12 hours
                });

                return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    admin: user.admin,
                    accessToken: token
                });
            })
            .catch(err => res.status(500).send({ error: err }));
    },
    autoLogin(req, res) {
        User.findOne({ where: { id: req.currentUser } })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ error: "User not found" });
                }

                const token = Jwt.sign({ id: user.id }, Config.secret, {
                    expiresIn: 43200 // 12 hours
                });

                return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    admin: user.admin,
                    accessToken: token
                });
            })
            .catch(err => res.status(500).send({ error: err }));
    },
    async register(req, res) {
        const validation = User.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        validation.user.password = Bcrypt.hashSync(validation.user.password, 8);
        return User.create(validation.user)
            .then(user => {
                const token = Jwt.sign({ id: user.id }, Config.secret, {
                    expiresIn: 43200 // 12 hours
                });

                return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    admin: user.admin,
                    accessToken: token
                });
            })
            .catch(error => res.status(400).send(error))
    },
};