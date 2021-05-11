const { Op } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Location = Models.location;
const Route = Models.route;

const LocationController = require('./location.controller');

module.exports = {
    async get(req, res) {
        const route = await Route.findByPk(req.params.route, { include: [User, Location] });
        if (!route) {
            return res.status(404).send({ error: `Route ${req.params.route} not found` });
        }

        return res.status(200).send(route);
    },
    async create(req, res) {
        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const validation = Route.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        return Route.create(validation.route)
            .then(async route => {
                await route.setUser(user);

                const location = await LocationController.createIfNotExist(validation.route.location);
                if (location) {
                    await route.setLocation(location);
                }

                await route.save();
                return res.status(200).send(route);
            })
            .catch(err => res.status(400).send({ error: err }));
    },
    async update(req, res) {
        const route = await Route.findByPk(req.params.route);
        if (!route) {
            return res.status(404).send({ error: `Route with id ${req.params.route} not found` });
        }

        if (route.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this route` });
        }

        const validation = Route.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Route.update(req.body, { where: { id: route.id } })
            .then(async () => {
                Route.findByPk(req.params.route, { include: [User, Location] })
                    .then(async route => {
                        const location = await LocationController.createIfNotExist(validation.route.location);
                        if (location) {
                            await route.setLocation(location);
                        }

                        await route.save();
                        return res.status(200).send(route);
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    async delete(req, res) {
        const route = await Route.findByPk(req.params.route, { include: [User, Location] });
        if (!route) {
            return res.status(404).send({ error: `Route ${req.params.route} not found` });
        }

        if (route.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this route` });
        }

        return Route.destroy({ where: { id: req.params.route } })
            .then(route => res.status(200).send({ deleted: route }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, title, location, price, seats, owner, date, order, direction } = req.query;
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        
        const condition = {};
        if (title) {
            condition.title = { [Op.like]: `%${title}%` };
        }
        if (location) {
            condition.locationId = parseInt(location);
        }
        if (price) {
            condition.price = { [Op.lte]: price };
        }
        if (seats) {
            condition.seats = { [Op.gte]: seats };
        }
        if (owner) {
            condition.userId = parseInt(owner);
        }
        if (date) {
            const fromDate = new Date(date);
            const toDate = new Date(date);
            fromDate.setDate(fromDate.getDate() - 1);
            toDate.setDate(toDate.getDate() + 1);
            condition.date = { [Op.between]: [fromDate, toDate] };
        }

        let orderQuery = [];
        if (order) {
            orderQuery.push([order, direction ? direction : 'ASC']);
        }

        return Route.findAndCountAll({ limit: limit, offset: offset, order: orderQuery, where: condition, include: [User, Location] })
            .then(routes => {
                const { count: totalItems, rows: data } = routes;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    }
};