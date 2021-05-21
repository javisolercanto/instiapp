const { Op } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Location = Models.location;
const Rental = Models.rental;

const LocationController = require('./location.controller');

module.exports = {
    async get(req, res) {
        const rental = await Rental.findByPk(req.params.rental, { include: [User, Location] });
        if (!rental) {
            return res.status(404).send({ error: `Rental ${req.params.rental} not found` });
        }

        return res.status(200).send(rental);
    },
    async create(req, res) {
        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const validation = Rental.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        return Rental.create(validation.rental)
            .then(async rental => {
                await rental.setUser(user);

                const location = await LocationController.createIfNotExist(validation.rental.location);
                if (location) {
                    await rental.setLocation(location);
                }

                await rental.save();
                return res.status(200).send(rental);
            })
            .catch(err => res.status(400).send({ error: err }));
    },
    async update(req, res) {
        const rental = await Rental.findByPk(req.params.rental);
        if (!rental) {
            return res.status(404).send({ error: `Rental with id ${req.params.rental} not found` });
        }

        if (rental.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this rental` });
        }

        const validation = Rental.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Rental.update(validation.rental, { where: { id: rental.id } })
            .then(async () => {
                Rental.findByPk(req.params.rental, { include: [User, Location] })
                    .then(async rental => {
                        const location = await LocationController.createIfNotExist(validation.rental.location);
                        if (location) {
                            await rental.setLocation(location);
                        }

                        await rental.save();
                        return res.status(200).send(rental);
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    async delete(req, res) {
        const rental = await Rental.findByPk(req.params.rental, { include: [User, Location] });
        if (!rental) {
            return res.status(404).send({ error: `Rental ${req.params.rental} not found` });
        }
        
        if (rental.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this rental` });
        }

        return Rental.destroy({ where: { id: req.params.rental } })
            .then(rental => res.status(200).send({ deleted: rental }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, title, location, price, owner, order, direction } = req.query;
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
        if (owner) {
            condition.userId = parseInt(owner);
        }

        let orderQuery = [];
        if (order) {
            orderQuery.push([order, direction ? direction : 'ASC']);
        }

        return Rental.findAndCountAll({ limit: limit, offset: offset, order: orderQuery, where: condition, include: [User, Location] })
            .then(rentals => {
                const { count: totalItems, rows: data } = rentals;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    }
};