const Models = require('../models');
const Location = Models.location;

module.exports = {
    async get(req, res) {
        const location = await Location.findByPk(req.params.location);
        if (!location) {
            return res.status(404).send({ error: `Location with id ${req.params.location} not found` });
        }

        return res.status(200).send(location);
    },
    async findByName(req, res) {
        const location = await Location.findOne({ where: { name: { $like: `%${req.params.location}%` } } });
        if (!location) {
            return res.status(404).send({ error: `Location ${req.params.location} not found` });
        }

        return res.status(200).send(location);
    },
    async findByCoords(req, res) {
        const location = await Location.findOne({
            where: {
                latitude: req.params.latitude,
                longitude: req.params.longitude
            }
        });

        if (!location) {
            return res.status(404).send({ error: `Location ${req.params.latitude}, ${req.params.longitude} not found` });
        }

        return res.status(200).send(location);
    },
    create(req, res) {
        const validation = Location.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Location.create(validation.location)
            .then(location => {
                return res.status(200).send(location);
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    update(req, res) {
        const validation = Location.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Location.update(validation.location, { where: { id: req.params.location } })
            .then(() => {
                Location.findByPk(req.params.location)
                    .then(location => {
                        return res.status(200).send(location)
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    delete(req, res) {
        return Location.destroy({ where: { id: req.params.location } })
            .then(location => res.status(200).send({ deleted: location }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, name } = req.query;
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        
        const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

        return Location.findAndCountAll({ limit: limit, offset: offset, where: condition })
            .then(locations => {
                const { count: totalItems, rows: data } = locations;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    },
    async createIfNotExist(location) {
        if (!location) {
            return null;
        }

        const searchedLocation = await Location.findOne({
            where: {
                latitude: location.latitude,
                longitude: location.longitude
            }
        });

        if (!searchedLocation) {
            const validation = Location.validate(location);
            if (validation.response !== 200) {
                return null;
            }

            return Location.create(validation.location)
                .then(location => {
                    return location;
                })
                .catch(err => {
                    return null;
                });
        }

        return searchedLocation;
    },
};