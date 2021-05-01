const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const Config = require("../config/auth.config.js");
const Models = require('../models');
const User = Models.user;
const Code = Models.code;

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
    async changePassword(req, res) {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).send({ error: 'You must provide your credentials' });
        }

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).send({ error: `User not found with email ${req.body.email}` });
        }

        const code = await Code.findOne({ where: { name: req.params.code, userId: user.id } });
        if (!code) {
            return res.status(400).send({ error: 'Recovering your password is not possible now, please contact with the support team' });
        }

        if (!req.body.password || req.body.password.length < 8 || req.body.password.length > 100) {
            return res.status(400).send({ error: 'Password must be between 8 and 100 characters' });
        }

        const samePassword = Bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (samePassword) {
            return res.status(400).send({ error: 'Password can\'t be the same' });
        }

        const newPassword = Bcrypt.hashSync(req.body.password, 8);
        return User.update({ password: newPassword }, { where: { id: user.id } })
            .then(user => res.status(200).send())
            .catch(error => res.status(400).send(error))
    },
};