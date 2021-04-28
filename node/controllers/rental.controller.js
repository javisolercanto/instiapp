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

        Rental.update(req.body, { where: { id: rental.id } })
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
    findByName(req, res) {
        return Rental.findAll({ include: [User, Location], where: { name: { $like: `%${req.params.rental}%` } } })
            .then(rentals => res.status(200).send(rentals))
            .catch(error => res.status(400).send(error))
    },
    findAll(_, res) {
        return Rental.findAll({ include: [User, Location] })
            .then(rentals => res.status(200).send(rentals))
            .catch(error => res.status(400).send(error))
    }
};