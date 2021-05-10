const { Op } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Product = Models.product;
const Category = Models.category;

module.exports = {
    async get(req, res) {
        const product = await Product.findByPk(req.params.product, { include: [User, Category] });
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
            return res.status(validation.response).send({ error: validation.error });
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
                return res.status(200).send(product);
            })
            .catch(err => res.status(400).send({ error: err }));
    },
    async update(req, res) {
        const product = await Product.findByPk(req.params.product);
        if (!product) {
            return res.status(404).send({ error: `Product with id ${req.params.product} not found` });
        }

        if (product.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this product` });
        }

        const validation = Product.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        console.log(validation.product);
        if (validation.product.category) {
            const category = await Category.findByPk(validation.product.category.id);
            if (!category) {
                return res.status(400).send({ error: `Category not found` });
            }

            await product.setCategory(category);
            await product.save();
        }

        Product.update(validation.product, { where: { id: req.params.product } })
            .then(() => {
                Product.findByPk(req.params.product, { include: [User, Category] })
                    .then(product => {
                        return res.status(200).send(product)
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    async delete(req, res) {
        const product = await Product.findByPk(req.params.product, { include: [User, Category] });
        if (!product) {
            return res.status(404).send({ error: `Product with id ${req.params.product} not found` });
        }

        if (product.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this product` });
        }

        return Product.destroy({ where: { id: req.params.product } })
            .then(product => res.status(200).send({ deleted: product }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, name, price, owner, category, order, direction } = req.query;
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        
        const condition = {};
        if (name) {
            condition.name = { [Op.like]: `%${name}%` };
        }
        if (category) {
            condition.categoryId = parseInt(category);
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

        return Product.findAndCountAll({ limit: limit, offset: offset, order: orderQuery, where: condition, include: [User, Category] })
            .then(products => {
                const { count: totalItems, rows: data } = products;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    }
};