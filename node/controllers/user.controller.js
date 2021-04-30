const Bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Post = Models.post;
const Product = Models.product;
const Rental = Models.rental;
const Route = Models.route;

const UserFields = ['id', 'name', 'username', 'email', 'image', 'admin', 'createdAt', 'updatedAt', 'password'];

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
    getPosts(req, res) {
        return User.findByPk(req.currentUser, {
            include: [Post],
            attributes: {
                exclude: UserFields
            }
        })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({ error: error }))
    },
    getProducts(req, res) {
        return User.findByPk(req.currentUser, {
            include: [Product],
            attributes: {
                exclude: UserFields
            }
        })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({ error: error }))
    },
    getRentals(req, res) {
        return User.findByPk(req.currentUser, {
            include: [Rental],
            attributes: {
                exclude: UserFields
            }
        })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({ error: error }))
    },
    getRoutes(req, res) {
        return User.findByPk(req.currentUser, {
            include: [Route],
            attributes: {
                exclude: UserFields
            }
        })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send({ error: error }))
    },
    delete(req, res) {
        return User.destroy({ where: { id: req.currentUser } })
            .then(user => res.status(200).json({ deleted: user }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, name } = req.query;
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        
        const condition = name ? { username: { [Op.like]: `%${name}%` } } : null;

        return User.findAndCountAll({ limit: limit, offset: offset, where: condition })
            .then(users => {
                const { count: totalItems, rows: data } = users;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    },
    findByUsername(req, res) {
        return User.findAll({ where: { username: req.username } })
            .then(user => res.status(200).send(user))
            .catch(error => res.status(400).send(error))
    },
};