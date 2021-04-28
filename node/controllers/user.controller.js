const Bcrypt = require('bcryptjs');
const Models = require('../models');
const User = Models.user;

module.exports = {
    update(req, res) {
        const validation = User.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        validation.user.password = Bcrypt.hashSync(validation.user.password, 8);

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