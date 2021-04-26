const Models = require('../models');
const User = Models.user;
const Code = Models.code;

module.exports = {
    async get(req, res) {
        const code = await Code.findOne({ where: { name: req.params.code, userId: null } });

        if (!code) {
            return res.status(404).send({ error: `Code ${req.params.code} not found` });
        }

        return res.status(200).send(code);
    },
    async asignCode(req, res) {
        const user = await User.findByPk(req.currentUser);
        const code = await Code.findOne({ where: { name: req.params.code, userId: null } });

        if (!code || !user) {
            return res.status(400).send({ error: 'User or code not found' });
        }

        await code.setUser(user);
        await code.save();

        return Code.findOne({ where: { name: req.params.code } })
            .then(code => res.status(200).send(code))
            .catch(err => res.status(400).send({ error: err }));
    },
    update(req, res) {
        Code.update(req.body, { where: { id: req.currentUser } })
            .then(() => {
                Code.findByPk(req.currentUser)
                    .then(user => {
                        return res.status(200).send(user)
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    delete(req, res) {
        return Code.destroy({ where: { id: req.currentUser } })
            .then(user => res.status(200).send({ deleted: user }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(_, res) {
        return Code.findAll({})
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error))
    }
};