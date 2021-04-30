const { Op } = require("sequelize");
const Models = require('../models');
const Category = Models.category;

module.exports = {
    async get(req, res) {
        const category = await Category.findByPk(req.params.category);

        if (!category) {
            return res.status(404).send({ error: `Category with id ${req.params.category} not found` });
        }

        return res.status(200).send(category);
    },
    create(req, res) {
        const validation = Category.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Category.create(validation.category)
            .then((category) => {
                return res.status(200).send(category)
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    update(req, res) {
        const validation = Category.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Category.update(validation.category, { where: { id: req.params.category } })
            .then(() => {
                Category.findByPk(req.params.category)
                    .then(category => {
                        return res.status(200).send(category)
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    delete(req, res) {
        return Category.destroy({ where: { id: req.params.category } })
            .then(category => res.status(200).send({ deleted: category }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, name } = req.query;
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        
        const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

        return Category.findAndCountAll({ limit: limit, offset: offset, where: condition })
            .then(categories => {
                const { count: totalItems, rows: data } = categories;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    },
};