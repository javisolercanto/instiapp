const Models = require('../models');
const User = Models.user;
const Product = Models.product;
const Category = Models.category;

module.exports = {
    async get(req, res) {
        const product = await Product.findByPk(req.params.product);
        if (!product) {
            return res.status(404).send({ error: `Product with id ${req.params.product} not found` });
        }

        return res.status(200).send(product);
    },
    async create(req, res) {
        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const validation = Product.validate(req.body);
        if (validation.response !== 200) {
            res.status(validation.response).send({ error: validation.error });
        }

        return Product.create(validation.product)
            .then(async product => {
                await product.setUser(user);
                if (validation.product.category) {
                    const category = await Category.findByPk(validation.product.category);
                    if (!category) {
                        return res.status(400).send({ error: `Category not found` });
                    }
                    await product.setCategory(category);
                }
                await product.save();
                res.status(200).send(product);
            })
            .catch(err => res.status(400).send({ error: err }));
    },
    async update(req, res) {
        const product = await Product.findByPk(req.params.product);
        if (!product) {
            return res.status(404).send({ error: `Product with id ${req.params.product} not found` });
        }

        const validation = Product.validate(req.body);
        if (validation.response !== 200) {
            res.status(validation.response).send({ error: validation.error });
        }

        if (validation.product.category) {
            const category = await Category.findByPk(validation.product.category);
            if (!category) {
                return res.status(400).send({ error: `Category not found` });
            }

            await product.setCategory(category);
            await product.save();
        }

        Product.update(validation.product, { where: { id: req.params.product } })
            .then(() => {
                Product.findByPk(req.params.product)
                    .then(product => {
                        return res.status(200).send(product)
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    delete(req, res) {
        return Product.destroy({ where: { id: req.params.product } })
            .then(product => res.status(200).send({ deleted: product }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findByName(req, res) {
        return Product.findAll({ where: { name: { $like: `%${req.params.product}%` } } })
            .then(product => res.status(200).send(product))
            .catch(error => res.status(400).send(error))
    },
    findAll(_, res) {
        return Product.findAll({})
            .then(product => res.status(200).send(product))
            .catch(error => res.status(400).send(error))
    }
};