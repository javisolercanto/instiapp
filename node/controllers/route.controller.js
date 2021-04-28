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
    findByName(req, res) {
        return Route.findAll({ include: [User, Location], where: { name: { $like: `%${req.params.route}%` } } })
            .then(routes => res.status(200).send(routes))
            .catch(error => res.status(400).send(error))
    },
    findAll(_, res) {
        return Route.findAll({ include: [User, Location] })
            .then(routes => res.status(200).send(routes))
            .catch(error => res.status(400).send(error))
    }
};