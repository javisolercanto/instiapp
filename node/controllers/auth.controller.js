const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const Config = require("../config/auth.config.js");
const axios = require('axios');
const Mail = require('./email.controller');
const Models = require('../models');
const User = Models.user;

let mailOptions = {
    from: 'instiweb.help@gmail.com',
};

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
    async recoverPassword(req, res) {
        if (!req.body || !req.body.email) {
            return res.status(400).send({ error: 'You must provide your credentials' });
        }

        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).send({ error: `User not found with email ${req.body.email}` });
        }

        let password = await axios.get('https://www.passwordrandom.com/query?command=password&format=json&count=1')
        if (!(password = password.data.char[0])) {
            return res.status(400).send({ error: `Error during the recovery process try again later` });
        }

        const encrypted = Bcrypt.hashSync(password);

        mailOptions.to = user.email
        mailOptions.subject = `Hi ${user.name}, your new password is here!`;
        mailOptions.text = `Here you have your new password:
        \n\t - ${password}
        \n Don't forget to change your password as soon as possible,
        \nThis is a support message please don't reply,`;

        Mail.send(mailOptions, function (error, info) {
            if (error) {
                return res.status(400).send({ error: error });
            } else {
                return User.update({ password: encrypted }, { where: { id: user.id } })
                    .then(user => res.status(200).send(true))
                    .catch(error => res.status(400).send(error))
            }}
        );
    },
};