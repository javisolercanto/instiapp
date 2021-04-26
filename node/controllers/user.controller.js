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
                    return res.status(404).send({ error: "User not found" });
                }

                const passwordIsValid = Bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        error: "Invalid Password!"
                    });
                }

                const token = Jwt.sign({ id: user.id }, Config.secret, {
                    expiresIn: 43200 // 12 hours
                });

                res.status(200).send({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    admin: user.admin,
                    accessToken: token
                });
            })
            .catch(err => {
                res.status(500).send({ error: err.error });
            });
    },
    update(req, res) {
        User.update(req.body, { where: { id: req.currentUser } })
            .then(() => {
                User.findByPk(req.currentUser)
                    .then(user => {
                        return res.status(200).send(user)
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    profile(req, res) {
        return User.findByPk(req.currentUser)
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({ error: error }))
    },
    delete(req, res) {
        return User.destroy({ where: { id: req.currentUser } })
            .then(user => res.status(200).json({ deleted: user }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(_, res) {
        return User.findAll({})
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error))
    },
    findByUsername(req, res) {
        return User.findAll({ where: { username: req.username } })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error))
    },
};